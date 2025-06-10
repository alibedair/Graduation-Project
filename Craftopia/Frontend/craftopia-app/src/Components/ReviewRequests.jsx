import { useEffect, useState } from "react";
import { ChatBubbleOvalLeftIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const ReviewRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [replyForms, setReplyForms] = useState({});
    const [showDetails, setShowDetails] = useState({});

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/customizationRequest/requests", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch requests.");

                const data = await response.json();
                setRequests(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRequests();
    }, []);

    const toggleReplyForm = (id) => {
        setReplyForms(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                showForm: !prev[id]?.showForm
            }
        }));
    };

    const toggleDetails = (id) => {
        setShowDetails(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleInputChange = (id, field, value) => {
        setReplyForms(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSubmitReply = async (requestId) => {
        const token = localStorage.getItem("token");
        const replyData = replyForms[requestId];

        if (!replyData || !replyData.price || !replyData.note || !replyData.estimationCompletionDate) {
            alert("Please fill in all required fields before submitting.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("price", replyData.price);
            formData.append("note", replyData.note);
            formData.append("estimationCompletionDate", replyData.estimationCompletionDate);

            if (replyData.imageFile) {
                formData.append("image", replyData.imageFile);
            }

            const response = await fetch(`http://localhost:3000/customizationResponse/respond/${requestId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit response.");
            }

            alert("Response sent successfully!");
            setReplyForms(prev => ({
                ...prev,
                [requestId]: { ...prev[requestId], showForm: false }
            }));
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 bg-[#FAF9F6]">
            <h2 className="text-3xl font-extrabold mb-8 text-black border-b-4 border-[#E07385] pb-2">
                Customization Requests
            </h2>

            {error && (
                <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
            )}

            {requests.length === 0 ? (
                <p className="text-center text-gray-700 text-lg">No customization requests found.</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {requests.map((request) => (
                        <div
                            key={request.requestId}
                            className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
                            style={{ backgroundColor: "#F6EEEE" }}
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="md:w-1/6 bg-[#F6EEEE] p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
                                    <p className="text-2xl font-bold text-[#E07385]">{request.offersCount || 0}</p>
                                    <p className="text-lg font-bold text-gray-700 mb-1">Offers</p>

                                </div>
                                {request.image && (
                                    <div className="hidden md:flex items-center">
                                        <div className="h-20 w-px bg-black"></div>
                                    </div>
                                )}
                                {request.image && (
                                    <div className="md:w-1/5">
                                        <img
                                            src={request.image}
                                            alt="Custom Request"
                                            className="w-full h-40 object-cover rounded-lg shadow"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div className="mr-4">
                                            <p className="font-semibold text-gray-500 text-lg mb-5">Product Title</p>
                                            <h3 className="text-xl font-semibold text-black  pb-2">
                                                {request.title || "Untitled Request"}
                                            </h3>
                                        </div>
                                        <div className="mr-4">
                                            <p className="font-semibold text-gray-500 text-lg mb-5">Product Budget</p>
                                            <h3 className="text-xl font-semibold text-black pb-2">
                                                💰{request.budget || "Untitled Request"} LE
                                            </h3>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => toggleReplyForm(request.requestId)}
                                                className="px-4 py-2 bg-[#E07385] hover:bg-[#c26075] text-white font-semibold rounded transition flex items-center justify-center gap-2"
                                            >
                                                {replyForms[request.requestId]?.showForm ? (
                                                    <>
                                                        <XMarkIcon className="h-4 w-4" />
                                                        Cancel Offer
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChatBubbleOvalLeftIcon className="h-4 w-4" />
                                                        Submit an Offer
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => toggleDetails(request.requestId)}
                                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition flex items-center justify-center gap-2"
                                            >
                                                {showDetails[request.requestId] ? (
                                                    <>
                                                        <ChevronUpIcon className="h-4 w-4" />
                                                        Hide Details
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDownIcon className="h-4 w-4" />
                                                        View Request Details
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {showDetails[request.requestId] && (
                                        <div className="mt-4 p-4 bg-[#F6EEEE] border border-gray-300 rounded-lg shadow-sm space-y-3">
                                            <p className="text-gray-800">
                                                <span className="font-semibold text-[#E07385]">Description:</span> {request.requestDescription}
                                            </p>
                                            <p className="text-gray-800">
                                                <span className="font-semibold text-[#E07385]">Status:</span> {request.status}
                                            </p>
                                            <p className="text-gray-800">
                                                <span className="font-semibold text-[#E07385]">Created At:</span> {request.createdAt}
                                            </p>
                                        </div>
                                    )}

                                    {replyForms[request.requestId]?.showForm && (
                                        <form
                                            onSubmit={e => {
                                                e.preventDefault();
                                                handleSubmitReply(request.requestId);
                                            }}
                                            className="mt-6 space-y-4"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-black font-medium mb-1">Price (LE):</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={replyForms[request.requestId]?.price || ""}
                                                        onChange={(e) => handleInputChange(request.requestId, "price", e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-black font-medium mb-1">Completion Date:</label>
                                                    <input
                                                        type="date"
                                                        value={replyForms[request.requestId]?.estimationCompletionDate || ""}
                                                        onChange={(e) => handleInputChange(request.requestId, "estimationCompletionDate", e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-black font-medium mb-1">Note:</label>
                                                <textarea
                                                    value={replyForms[request.requestId]?.note || ""}
                                                    onChange={(e) => handleInputChange(request.requestId, "note", e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-black font-medium mb-1">Attach Image (optional):</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleInputChange(request.requestId, "imageFile", e.target.files[0])}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-[#921A40] hover:bg-[#7e1533] text-white font-semibold py-2 px-4 rounded"
                                            >
                                                Submit Offer
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewRequests;