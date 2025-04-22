import { useState, useEffect } from "react";
import CompleteProfile from "./CompleteProfile";

const Profile = ({ onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetch("http://localhost:3000/customer/getprofile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch profile");
          return response.json();
        })
        .then((data) => {
          setProfileData(data.customerProfile);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    setShowEdit(false);
  };

  const isComplete =
    profileData?.name &&
    profileData?.username &&
    profileData?.phone &&
    profileData?.address;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black opacity-50 z-40">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {!showEdit ? (
        <div className="relative">
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] border border-black rounded-lg p-6 shadow-lg w-96 z-50">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-xl text-black hover:text-gray-500"
            >
              <i className="fa fa-times"></i>
            </button>

            <h2 className="text-2xl font-bold mb-4 text-black text-center">My Account</h2>

            <div className="space-y-3 text-black">
              <p><strong>Name:</strong> {profileData?.name || "Not available"}</p>
              <p><strong>Username:</strong> {profileData?.username || "Not available"}</p>
              <p><strong>Phone:</strong> {profileData?.phone || "Not available"}</p>
              <p><strong>Address:</strong> {profileData?.address || "Not available"}</p>

              {profileData?.profilePicture && (
                <div className="flex justify-center">
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="rounded-full w-32 h-32 object-cover mt-4 border border-black"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              {isComplete ? (
                <button
                  onClick={() => setShowEdit(true)}
                  className="w-full bg-black text-white py-2 rounded hover:bg-[#FAF9F6] hover:text-black border hover:border-black transition duration-300"
                >
                  Edit Account
                </button>
              ) : (
                <p style={{ color: '#921A40' }} className="text-center font-medium">
                Please complete your Account first.
              </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CompleteProfile
          onClose={() => setShowEdit(false)}
          onProfileComplete={handleProfileUpdate}
          initialProfile={profileData}
        />
      )}
    </>
  );
};

export default Profile;
