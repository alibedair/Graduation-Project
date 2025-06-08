import { useState, useEffect } from "react";

const GetProfile = ({ setActiveTab }) => { 
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/artist/getprofile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data.artist);
      } catch (err) {
        setMessage("Please complete your profile.");
      }
    };

    fetchProfile();
  }, []);

 if (message) {
    return (
      <div className="text-red-600">
        <p>{message}</p>
        <button
          onClick={() => setActiveTab("edit")}
          className="mt-4 px-4 py-2 bg-[#E07385] text-white rounded hover:bg-[#921A40] transition"
        >
          Complete Your Profile
        </button>
      </div>
    );
  }


  if (!profile) return <p className="text-gray-600">Loading profile...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
                <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                        <img
                            src={profile.profilePicture || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-2 border-[#E07385] shadow-md"
                        />
                        <div>
                            <h1 className="text-2xl font-bold mt-3">{profile.name || "Artist Name"}</h1>
                            <p className="text-lg text-[#921A40] mt-2">@{profile.username || "username"}</p>
                        </div>
                    </div>

                    <p className="text-black bg-[#F6EEEE] p-6 rounded-lg shadow-md text-xl leading-relaxed mt-10 ml-[-50px] md:ml-[-30px]">
                        {profile.biography ||
                            "Add your biography here. This is a placeholder text to give you an idea of how the biography section will look."}
                    </p>
                </div>
                {profile.profileVideo && (
                    <div className="w-full md:w-1/3 p-2">
                        <video
                            src={profile.profileVideo}
                            controls
                            className="w-full h-64 md:h-80 rounded-xl shadow-lg border-4 border-[#E07385] hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                    </div>
                )}
            </div>
            <div>
                <p className="text-xl font-bold mb-2">Gallery Products</p>
                <p className="text-gray-600 mb-4">Auction products</p>

            </div>
        </div>
    );
};

export default GetProfile;