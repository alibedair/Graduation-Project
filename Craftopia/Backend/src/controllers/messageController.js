const Message = require('../models/message');
const CustomizationRequest = require('../models/customizationRequest');
const CustomizationResponse = require('../models/customizationResponse');
const Customer = require('../models/customer');
const Artist = require('../models/artist');
const User = require('../models/user');
const uploadBuffer = require('../utils/cloudinaryUpload');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');


const validateMessageContent = (content) => {
    if (!content) return { isValid: true };

    const personalDataPatterns = [
        // Phone numbers (various formats)
        /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
        /(?:\+?[1-9]\d{0,3}[-.\s]?)?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/g,
        
        // Email addresses
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        
        // URLs
        /https?:\/\/[^\s]+/g,
        /www\.[^\s]+/g,
  
        // Common address patterns
        /\b\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|place|pl)\b/gi,
    ];

    const suspiciousWords = [
        'address', 'phone', 'mobile', 'email', 'contact me at',
        'call me', 'whatsapp', 'telegram', 'instagram',
        'facebook', 'twitter', 'linkedin', 'snapchat', 'tiktok',
        'my number is', 'reach me at', 'find me on'
    ];

    for (const pattern of personalDataPatterns) {
        if (pattern.test(content)) {
            return {
                isValid: false,
                reason: 'Message contains personal information like phone numbers, emails, or addresses'
            };
        }
    }
    const lowerContent = content.toLowerCase();
    for (const word of suspiciousWords) {
        if (lowerContent.includes(word)) {
            return {
                isValid: false,
                reason: 'Message contains terms that suggest sharing personal contact information'
            };
        }
    }

    return { isValid: true };
};

exports.sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { responseId} = req.params;
        const {messageContent, attachment} = req.body;
        if (!messageContent || messageContent.trim() === '') {
            return res.status(400).json({ message: 'Message content is required' });
        }
        const userId = req.user.id;        
        const customizationResponse = await CustomizationResponse.findByPk(responseId);
        if (!customizationResponse) {
            return res.status(404).json({ message: 'Customization response not found' });
        }

        if (customizationResponse.status !== 'ACCEPTED') {
            return res.status(403).json({ message: 'Messages can only be sent for accepted customization responses' });
        }

        const requestId = customizationResponse.requestId;
        const customizationRequest = await CustomizationRequest.findByPk(requestId);
        
        const user = await User.findByPk(userId);
        let isAuthorized = false;
        let senderId, senderType, receiverId, receiverType;
        if (user.role === 'customer') {
            const customer = await Customer.findOne({ where: { userId } });
            isAuthorized = customer && customizationRequest.customerId === customer.customerId;
            senderId = customer.customerId;
            senderType = 'customer';
            receiverId = customizationResponse.artistId;
            receiverType = 'artist';
        } else if (user.role === 'artist') {
            const artist = await Artist.findOne({ where: { userId } });
            isAuthorized = artist && customizationResponse.artistId === artist.artistId;
             senderId = artist.artistId;
            senderType = 'artist';
            receiverId = customizationRequest.customerId;
            receiverType = 'customer';
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'You are not authorized to send messages for this response' });
        }        
        const contentValidation = validateMessageContent(messageContent);
        if (!contentValidation.isValid) {
            return res.status(400).json({ 
                message: 'Message content not allowed',
                reason: contentValidation.reason 
            });
        }
        const uploadPromises = [];
        let attachmentUrl = attachment || '';
        if (req.files) {
            if (req.files.attachment && req.files.attachment[0]) {
                const attachmentFile = req.files.attachment[0];
                if (attachmentFile.mimetype.startsWith('image/')) {
                    uploadPromises.push(
                        uploadBuffer(attachmentFile.buffer, {
                            folder: `messages/${requestId}`,
                            resource_type: 'image',
                            public_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        }).then(result => {
                            attachmentUrl = result.secure_url || '';
                        })
                    );
                } else if (attachmentFile.mimetype.startsWith('video/')) {
                    uploadPromises.push(
                        uploadBuffer(attachmentFile.buffer, {
                            folder: `messages/${requestId}`,
                            resource_type: 'video',
                            public_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        }).then(result => {
                            attachmentUrl = result.secure_url || '';
                        })
                    );
                } else {
                    return res.status(400).json({ 
                        message: 'Only image and video files are allowed as attachments' 
                    });
                }
            }
            
            if (uploadPromises.length > 0) {
                try {
                    await Promise.all(uploadPromises);
                } catch (uploadError) {
                    console.error('Error uploading attachment:', uploadError);
                    return res.status(500).json({ message: 'Failed to upload attachment' });
                }
            }
        }

        const message = await Message.create({
            requestId,
            senderId,
            senderType,
            receiverId,
            receiverType,
            messageContent,
            attachmentUrl: attachmentUrl || ''
        });

        return res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        const customizationRequest = await CustomizationRequest.findByPk(requestId);
        if (!customizationRequest) {
            return res.status(404).json({ message: 'Customization request not found' });
        }

  
        const user = await User.findByPk(userId);
        let hasAccess = false;

        if (user.role === 'customer') {
            const customer = await Customer.findOne({ where: { userId } });
            hasAccess = customer && customizationRequest.customerId === customer.customerId;
        } else if (user.role === 'artist') {
            const artist = await Artist.findOne({ where: { userId } });
            if (artist) {
                
                
                const response = await CustomizationResponse.findOne({
                    where: { 
                        requestId,
                        artistId: artist.artistId 
                    }
                });
                hasAccess = !!response;
            }
        }

        if (!hasAccess) {
            return res.status(403).json({ message: 'You do not have access to this conversation' });
        }

     
        const messages = await Message.findAll({
            where: { requestId },
            order: [['createdAt', 'ASC']]
        });

        const userRole = user.role;
        const userRecord = userRole === 'customer' 
            ? await Customer.findOne({ where: { userId } })
            : await Artist.findOne({ where: { userId } });

        if (userRecord) {
            await Message.update(
                { 
                    isRead: true, 
                    readAt: new Date() 
                },
                {
                    where: {
                        requestId,
                        receiverId: userRecord[userRole === 'customer' ? 'customerId' : 'artistId'],
                        receiverType: userRole,
                        isRead: false
                    }
                }
            );
        }

        return res.status(200).json({
            messages,
            totalCount: messages.length
        });

    } catch (error) {
        console.error('Error getting messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        let userRecord;
        let userType;
        let userIdField;

        if (user.role === 'customer') {
            userRecord = await Customer.findOne({ where: { userId } });
            userType = 'customer';
            userIdField = 'customerId';
        } else if (user.role === 'artist') {
            userRecord = await Artist.findOne({ where: { userId } });
            userType = 'artist';
            userIdField = 'artistId';
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!userRecord) {
            return res.status(404).json({ message: 'User profile not found' });
        }

      
        let conversations = [];

        if (user.role === 'customer') {
           
            const acceptedResponses = await CustomizationResponse.findAll({
                include: [{
                    model: CustomizationRequest,
                    where: { customerId: userRecord.customerId },
                    attributes: ['requestId', 'title', 'requestDescription', 'status']
                }],
                where: { status: 'accepted' },
                attributes: ['responseId', 'artistId', 'requestId']
            });

            for (const response of acceptedResponses) {
                const messageCount = await Message.count({
                    where: { requestId: response.requestId }
                });

                const lastMessage = await Message.findOne({
                    where: { requestId: response.requestId },
                    order: [['createdAt', 'DESC']],
                    attributes: ['createdAt', 'messageContent', 'attachmentUrl']
                });

                if (messageCount > 0) {
                    conversations.push({
                        responseId: response.responseId,
                        requestId: response.requestId,
                        artistId: response.artistId,
                        request: response.customizationRequest,
                        messageCount,
                        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
                        lastMessageContent: lastMessage ? lastMessage.messageContent : null,
                        lastMessageAttachment: lastMessage ? lastMessage.attachmentUrl : null
                    });
                }
            }
        } else if (user.role === 'artist') {
            const acceptedResponses = await CustomizationResponse.findAll({
                where: { 
                    artistId: userRecord.artistId,
                    status: 'accepted'
                },
                include: [{
                    model: CustomizationRequest,
                    attributes: ['requestId', 'title', 'requestDescription', 'status', 'customerId']
                }],
                attributes: ['responseId', 'requestId']
            });

            
            for (const response of acceptedResponses) {
                const messageCount = await Message.count({
                    where: { requestId: response.requestId }
                });

                const lastMessage = await Message.findOne({
                    where: { requestId: response.requestId },
                    order: [['createdAt', 'DESC']],
                    attributes: ['createdAt', 'messageContent', 'attachmentUrl']
                });

                if (messageCount > 0) {
                    conversations.push({
                        responseId: response.responseId,
                        requestId: response.requestId,
                        customerId: response.customizationRequest.customerId,
                        request: response.customizationRequest,
                        messageCount,
                        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
                        lastMessageContent: lastMessage ? lastMessage.messageContent : null,
                        lastMessageAttachment: lastMessage ? lastMessage.attachmentUrl : null
                    });
                }
            }
        }

        // Sort conversations by last message time (newest first)
        conversations.sort((a, b) => {
            if (!a.lastMessageTime && !b.lastMessageTime) return 0;
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });

        return res.status(200).json({
            conversations,
            totalCount: conversations.length
        });

    } catch (error) {
        console.error('Error getting conversations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUnreadMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        let userRecord;
        let userType;
        let userIdField;

        if (user.role === 'customer') {
            userRecord = await Customer.findOne({ where: { userId } });
            userType = 'customer';
            userIdField = 'customerId';
        } else if (user.role === 'artist') {
            userRecord = await Artist.findOne({ where: { userId } });
            userType = 'artist';
            userIdField = 'artistId';
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!userRecord) {
            return res.status(404).json({ message: 'User profile not found' });
        }        const unreadMessages = await Message.findAll({
            where: {
                receiverId: userRecord[userIdField],
                receiverType: userType,
                isRead: false
            },
            include: [{
                model: CustomizationRequest,
                attributes: ['requestId', 'title', 'requestDescription', 'status']
            }],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            unreadMessages,
            unreadCount: unreadMessages.length
        });

    } catch (error) {
        console.error('Error getting unread count:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMessagesByResponse = async (req, res) => {
    try {
        const { responseId } = req.params;
        const userId = req.user.id;

   
        const customizationResponse = await CustomizationResponse.findByPk(responseId);
        if (!customizationResponse) {
            return res.status(404).json({ message: 'Customization response not found' });
        }

   
        if (customizationResponse.status !== 'accepted') {
            return res.status(403).json({ message: 'Messages can only be accessed for accepted responses' });
        }

   
        const requestId = customizationResponse.requestId;
        const customizationRequest = await CustomizationRequest.findByPk(requestId);
        if (!customizationRequest) {
            return res.status(404).json({ message: 'Customization request not found' });
        }

        // Verify user has access to this conversation
        const user = await User.findByPk(userId);
        let hasAccess = false;

        if (user.role === 'customer') {
            const customer = await Customer.findOne({ where: { userId } });
            hasAccess = customer && customizationRequest.customerId === customer.customerId;
        } else if (user.role === 'artist') {
            const artist = await Artist.findOne({ where: { userId } });
            hasAccess = artist && customizationResponse.artistId === artist.artistId;
        }

        if (!hasAccess) {
            return res.status(403).json({ message: 'You do not have access to this conversation' });
        }

       
        const messages = await Message.findAll({
            where: { requestId },
            order: [['createdAt', 'ASC']]
        });

       
        const userRole = user.role;
        const userRecord = userRole === 'customer' 
            ? await Customer.findOne({ where: { userId } })
            : await Artist.findOne({ where: { userId } });

        if (userRecord) {
            await Message.update(
                { 
                    isRead: true, 
                    readAt: new Date() 
                },
                {
                    where: {
                        requestId,
                        receiverId: userRecord[userRole === 'customer' ? 'customerId' : 'artistId'],
                        receiverType: userRole,
                        isRead: false
                    }
                }
            );
        }

        return res.status(200).json({
            messages,
            totalCount: messages.length,
            responseId,
            requestId,
            conversationInfo: {
                response: customizationResponse,
                request: customizationRequest
            }
        });

    } catch (error) {
        console.error('Error getting messages by response:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
