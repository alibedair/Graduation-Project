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
          throw new Error('Failed to update profile');
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
    <div className="relative">
      <div className="fixed inset-0 bg-black opacity-50 z-40" />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] border border-black rounded-lg p-6 shadow-lg w-96 z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-black hover:text-gray-500"
        >
          <i className="fa fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-black text-center">Complete Your Account</h2>

        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-black font-medium">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-black font-medium">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-black font-medium">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-black font-medium">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-[#FAF9F6] hover:text-black border hover:border-black transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;