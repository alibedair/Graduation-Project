import { useEffect, useState } from "react";
import { ChatBubbleOvalLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ReviewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  const [replyForms, setReplyForms] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});

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
    setShowReplyForm(prev => ({
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
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/customizationResponse/respond/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(replyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit response.");
      }

      alert("Response sent successfully!");
      setShowReplyForm(prev => ({ ...prev, [requestId]: false }));
      setReplyForms(prev => ({ ...prev, [requestId]: {} }));
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <li
              key={request.requestId}
              className="rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col"
              style={{ backgroundColor: "#F6EEEE" }}
            >
              <h3 className="text-xl font-semibold text-black mb-2 truncate" title={request.title}>
                {request.title || "Untitled Request"}
              </h3>

              <p className="text-black flex-grow mb-4 leading-relaxed">{request.description}</p>

              <p className="font-semibold text-black mb-4 text-lg">
                💰 Budget: <span className="text-[#E07385]">{request.budget} LE</span>
              </p>

              {request.image && (
                <img
                  src={request.image}
                  alt="Custom Request"
                  className="w-full h-48 object-contain rounded-md border border-gray-300"
                  loading="lazy"
                />
              )}

              <button
                onClick={() => toggleReplyForm(request.requestId)}
                className="mt-4 bg-[#E07385] hover:bg-[#c26075] text-white font-semibold py-2 rounded transition flex items-center justify-center"
                aria-label={showReplyForm[request.requestId] ? "Cancel Reply" : "Send Reply"}
              >
                {showReplyForm[request.requestId] ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                )}
              </button>

              {showReplyForm[request.requestId] && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSubmitReply(request.requestId);
                  }}
                  className="mt-4 space-y-4"
                >
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
                    <label className="block text-black font-medium mb-1">Estimated Completion Date:</label>
                    <input
                      type="date"
                      value={replyForms[request.requestId]?.estimationCompletionDate || ""}
                      onChange={(e) => handleInputChange(request.requestId, "estimationCompletionDate", e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#921A40] hover:bg-[#7e1533] text-white font-semibold py-2 rounded w-full"
                  >
                    Submit Reply
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewRequests;
