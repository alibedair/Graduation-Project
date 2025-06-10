import { useState } from "react";

const CompleteProfile = ({ onClose, onProfileComplete, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || "");
  const [username, setUsername] = useState(initialProfile?.username || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [address, setAddress] = useState(initialProfile?.address || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !username || !phone || !address) {
      setError("Please fill in all fields.");
      setSuccessMessage("");
      return;
    }

    const profileData = { name, username, phone, address };
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/customer/createprofile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        return response.json();
      })
      .then((data) => {
        setSuccessMessage("Profile updated successfully!");
        setError("");
        onProfileComplete(data.customerProfile || data.existingCustomer);
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile.");
        setSuccessMessage("");
      });
  };

  return (
    <div className="w-full bg-[#F6EEEE] mt-5 p-4 rounded-lg shadow-md">
      <div className="bg-[#F6EEEE] p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-black">Complete Your Account</h2>

        {successMessage && (
          <p className="text-green-600 mb-4">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-[#E07385] text-white px-5 py-2 rounded hover:bg-[#921A40] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
