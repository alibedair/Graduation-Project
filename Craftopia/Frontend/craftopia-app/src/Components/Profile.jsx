import { useState, useEffect } from "react";
import CompleteProfile from "./CompleteProfile";

const Profile = ({ initialShowEdit = false, onProfileComplete, initialProfile }) => {
  const [profileData, setProfileData] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!initialProfile);
  const [showEdit, setShowEdit] = useState(initialShowEdit);
  const [profileMissing, setProfileMissing] = useState(false);

  useEffect(() => {
    if (!initialProfile) {
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
            if (!data.customerProfile || !data.customerProfile.name) {
              setProfileMissing(true);
            } else {
              setProfileData(data.customerProfile);
              setProfileMissing(false);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching profile:", error);
            setLoading(false);
            setProfileMissing(true);
          });
      } else {
        setLoading(false);
        setProfileMissing(true);
      }
    }
  }, [initialProfile]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    if (onProfileComplete) onProfileComplete(updatedProfile);
    setShowEdit(false);
    setProfileMissing(false);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (showEdit) {
    return (
      <CompleteProfile
        onProfileComplete={handleProfileUpdate}
        initialProfile={profileData}
      />
    );
  }

  if (profileMissing) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 text-lg mb-4">Please create your profile first.</p>
        <button
          onClick={() => setShowEdit(true)}
          className="bg-[#E07385] text-white px-6 py-3 rounded-full hover:bg-[#921A40] transition"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-24 h-24 rounded-full bg-[#921A40] flex items-center justify-center text-3xl font-bold text-white border-2 border-[#E07385] shadow-md">
              {profileData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-3xl font-bold mt-3 text-black">
                {profileData?.name || "Name"}
              </h2>
              <p className="text-lg text-[#921A40] mt-2">
                @{profileData?.username || "username"}
              </p>
            </div>
          </div>

          <div className="text-black bg-[#F6EEEE] p-6 rounded-lg shadow-md text-xl leading-relaxed mt-6">
            <p><strong>Phone:</strong> {profileData?.phone || "Not provided"}</p>
            <p className="mt-2"><strong>Address:</strong> {profileData?.address || "Not provided"}</p>
          </div>
        </div>
      </div>

    <button
  onClick={() => setShowEdit(true)}
  className="mt-8 w-full md:w-1/3 bg-white border-2 border-[#E07385] text-[#E07385] py-3 rounded-full font-semibold hover:bg-[#E07385] hover:text-white transition duration-300"
>
  ✏️ Edit Account
</button>

    </div>
  );
};

export default Profile;
