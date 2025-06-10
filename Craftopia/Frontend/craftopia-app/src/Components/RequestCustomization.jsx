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
  const fileInputRef = useRef(null);
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

  return (
    <div className="max-w-4xl mt-5 bg-[#F6EEEE] p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-[black] mb-6">Tell Us What You Need</h2>
      {message && (
        <div className="mb-6 text-center text-[#E07385] font-medium">{message}</div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          ></textarea>
          <input
            type="text"
            name="budget"
            placeholder="Budget (LE)"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="mt-8 w-full md:w-1/3 bg-white border-2 border-[#E07385] text-[#E07385] py-3 rounded-full font-semibold hover:bg-[#E07385] hover:text-white transition duration-300"
          >
            📩 Submit Request
          </button>
        </form>

        <div className="md:w-1/3 flex flex-col items-center space-y-4">
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
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-[#E07385]">Artist Replies</h3>
       {replies.length === 0 ? (
  <p className="text-gray-500 text-center">No replies yet.</p>
) : (
  replies.map((reply) => {
    const estimatedDate = reply.estimationCompletionDate
      ? new Date(reply.estimationCompletionDate)
      : null;
    const isValidDate = estimatedDate instanceof Date && !isNaN(estimatedDate);
    
    const sentDate = reply.createdAt || reply.updatedAt;
    const formattedSentDate = sentDate
      ? new Date(sentDate).toLocaleString()
      : "Unknown";

    return (
      <div
        key={reply.responseId || reply._id || reply.id || reply.requestId}
        className="mb-6 border border-[#E07385] rounded-lg p-4 bg-[#FAF9F6]"
      >
        <p><strong>Request ID:</strong> {reply.requestId || "Not available"}</p>
        <p><strong>Price:</strong> {reply.price ? `${reply.price} LE` : "Not specified"}</p>
        {reply.note && <p><strong>Note:</strong> {reply.note}</p>}
        <p>
          <strong>Estimated Completion Date:</strong>{" "}
          {isValidDate ? estimatedDate.toLocaleDateString() : "Not provided"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Sent on: {formattedSentDate}
        </p>
      </div>
    );
  })
)}
      </div>
    </div>
  );
};

export default RequestCustomization;
