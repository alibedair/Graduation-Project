import { useState, useRef, useEffect } from "react";

const RequestCustomization = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState(null);
    const [replies, setReplies] = useState([]);
    const [groupedReplies, setGroupedReplies] = useState({});
    const fileInputRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [expandedRequestIds, setExpandedRequestIds] = useState([]);
    const [selectedReply, setSelectedReply] = useState(null);

    useEffect(() => {
        const fetchReplies = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:3000/customizationResponse/responses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch replies.");
                const data = await res.json();
                setReplies(data);
                const grouped = data.reduce((acc, reply) => {
                    const requestId = reply.requestId;
                    if (!acc[requestId]) {
                        acc[requestId] = [];
                    }
                    acc[requestId].push(reply);
                    return acc;
                }, {});
                setGroupedReplies(grouped);
            } catch (error) {
                console.error("Error fetching replies:", error);
            }
        };

        fetchReplies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        const form = new FormData();
        form.append("title", formData.title);
        form.append("description", formData.description);
        form.append("budget", formData.budget);
        form.append("image", formData.image);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:3000/customizationRequest/request",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: form,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send customization request.");
            }

            const data = await response.json();
            console.log("Response body:", data);

            setMessage("Request submitted successfully!");
            setFormData({ title: "", description: "", budget: "", image: null });
            setPreview(null);
        } catch (error) {
            console.error(error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const toggleRequest = (requestId) => {
        setExpandedRequestIds((prev) =>
            prev.includes(requestId)
                ? prev.filter((id) => id !== requestId)
                : [...prev, requestId]
        );
    };

    const handleAccept = async (replyId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `http://localhost:3000/customizationResponse/accept/${replyId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to accept reply.");
            }
            alert("Offer accepted successfully!");
            const res = await fetch("http://localhost:3000/customizationResponse/responses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setReplies(data);
            const grouped = data.reduce((acc, reply) => {
                const requestId = reply.requestId;
                if (!acc[requestId]) {
                    acc[requestId] = [];
                }
                acc[requestId].push(reply);
                return acc;
            }, {});
            setGroupedReplies(grouped);
        } catch (error) {
            console.error(error);
            alert("Error accepting offer: " + error.message);
        }
    };

    const handleDecline = async (replyId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `http://localhost:3000/customizationResponse/decline/${replyId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to decline reply.");
            }
            alert("Offer declined successfully!");
            const res = await fetch("http://localhost:3000/customizationResponse/responses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setReplies(data);
            const grouped = data.reduce((acc, reply) => {
                const requestId = reply.requestId;
                if (!acc[requestId]) {
                    acc[requestId] = [];
                }
                acc[requestId].push(reply);
                return acc;
            }, {});
            setGroupedReplies(grouped);
        } catch (error) {
            console.error(error);
            alert("Error declining offer: " + error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not provided";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            PENDING: "bg-yellow-100 text-yellow-800",
            ACCEPTED: "bg-green-100 text-green-800",
            DECLINED: "bg-red-100 text-red-800"
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl bg-[#FAF9F6] p-8 rounded-3xl">
            {!showForm ? (
                <>
                    <h2 className="text-4xl font-extrabold text-[black] mb-8 tracking-wide">
                        🎨 Artist Offers
                    </h2>
                    <div className="bg-[#FAF9F6] p-6 rounded-2xl shadow-md max-w-3xl ml-0 mr-auto space-y-6">
                        {Object.keys(groupedReplies).length === 0 ? (
                            <p className="text-gray-500 text-center text-lg">No offers yet.</p>
                        ) : (
                            Object.entries(groupedReplies).map(([requestId, replies]) => {
                                const firstReply = replies[0];
                                const request = firstReply.customizationrequest || {};

                                return (
                                    <div
                                        key={requestId}
                                        className="border border-[#E07385]/40 rounded-xl p-5 bg-[#F6EEEE] shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleRequest(requestId)}
                                        >
                                            <div className="flex items-center gap-4">
                                                {request.image && (
                                                    <img
                                                        src={request.image}
                                                        alt="Request"
                                                        className="w-20 h-20 object-cover rounded-lg border border-[#E07385]/30 shadow-sm"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-xl font-semibold text-[black]">
                                                        🛍️ {request.title || "Unknown Product"}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-l text-gray-500">
                                                            {replies.length} {replies.length === 1 ? "offer" : "offers"} available
                                                        </p>

                                                        {replies.some(r => r.status === 'ACCEPTED') && (
                                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                                Accepted
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-2xl text-[#E07385] font-bold">
                                                {expandedRequestIds.includes(requestId) ? "▲" : "▼"}
                                            </span>
                                        </div>

                                        {expandedRequestIds.includes(requestId) && (
                                            <div className="mt-4 pt-4  space-y-6">
                                                {replies.map((reply) => (
                                                    <div
                                                        key={reply.responseId}
                                                        className={`p-4 rounded-lg border border-gray-200 ${selectedReply === reply.responseId
                                                            ? 'bg-[color:var(--color-coral)/10]'
                                                            : 'bg-white'
                                                            }`}
                                                    >

                                                        <div className="flex items-center justify-between gap-4 mb-3">
                                                            <div className="flex items-center gap-3">
                                                                {reply.artist?.profilePicture && (
                                                                    <img
                                                                        src={reply.artist.profilePicture}
                                                                        alt="Artist"
                                                                        className="w-17 h-17 rounded-full object-cover"
                                                                    />
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg font-semibold text-black">
                                                                        {reply.artist?.username || "Unknown Artist"}
                                                                    </span>
                                                                    {getStatusBadge(reply.status)}
                                                                </div>

                                                            </div>
                                                            <span className="text-xl font-bold text-[#921A40]">
                                                                {reply.price} LE
                                                            </span>
                                                        </div>

                                                        {reply.notes && (
                                                            <p className="text-gray-700 mb-3">
                                                                <strong className="text-[#E07385]">Note:</strong> {reply.notes}
                                                            </p>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                            <p>
                                                                <strong className="text-[#E07385]">EstimationCompletionTime</strong>{" "}
                                                                {formatDate(reply.estimationCompletionTime)}
                                                            </p>
                                                            <p className="text-right text-gray-500">
                                                                Offered on: {formatDate(reply.createdAt)}
                                                            </p>
                                                        </div>

                                                        {reply.image && (
                                                            <div className="mb-3">
                                                                <div className="inline-block bg-[#E07385]/10 text-[#E07385] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                                                                    🎨 Artist's Proposal
                                                                </div>
                                                                <img
                                                                    src={reply.image}
                                                                    alt="Reply Image"
                                                                    className="w-28 h-28 object-cover rounded-lg shadow border border-[#E07385]/30"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="flex justify-end gap-4 mt-4">
                                                            {reply.status === 'PENDING' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleDecline(reply.responseId)}
                                                                        className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-700 transition"
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedReply(reply.responseId);
                                                                            handleAccept(reply.responseId);
                                                                        }}
                                                                        className="bg-[#e07385] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#c26075] transition"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="text-sm italic text-gray-500">
                                                                    {reply.status === 'ACCEPTED' ?
                                                                        "You've accepted this offer" :
                                                                        "You've declined this offer"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        <div className="text-center mt-10">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[#E07385] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#c75d70] shadow-md transition duration-300"
                            >
                                ➕ Add New Request
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-extrabold text-[black] mb-6  ">
                        Tell Us What You Need
                    </h2>

                    {message && (
                        <div className="mb-6 text-center text-[#E07385] font-medium">{message}</div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                            <div className="flex flex-col">
                                <label className="font-semibold mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E07385] transition"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-semibold mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E07385] transition"
                                    rows={4}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-semibold mb-1">
                                    Budget (LE) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="budget"
                                    placeholder="Budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E07385] transition"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-8 w-full md:w-1/3 bg-[#E07385] text-white py-3 rounded-full font-semibold hover:bg-white hover:text-[#E07385] border-2 border-[#E07385] transition duration-300"
                            >
                                📩 Submit Request
                            </button>
                        </form>
                        <div className="md:w-1/3 flex flex-col items-center space-y-4">
                            <label className="font-semibold">
                                Upload Your Design <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                required
                            />
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="cursor-pointer w-full border-2 border-dashed border-[#E07385] rounded-lg py-12 flex justify-center items-center text-[#E07385] font-semibold text-lg hover:bg-[#E07385] hover:text-white transition duration-300 select-none"
                            >
                                ➕ Upload Your Design
                            </div>

                            {preview && (
                                <div className="flex justify-center mt-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-40 h-40 object-contain rounded-lg shadow"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-[#E07385] hover:underline font-medium"
                        >
                            ⬅ Back to Offers
                        </button>
                    </div>
                </>

            )}
        </div>
    );
};

export default RequestCustomization;