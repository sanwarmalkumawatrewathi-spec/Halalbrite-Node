import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import CustomModal from "./CustomModal";

export default function ProfileTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const router = useRouter();
  const { user, isOrganizer, becomeOrganizer, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "+44 7700 900000",
    bio: user?.bio || "",
    username: user?.username || ""
  });

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    onConfirm: () => {},
    showCancel: true,
    type: "info" as "info" | "success" | "warning" | "error"
  });

  const handleBecomeOrganizer = async () => {
    setModalConfig({
      title: "Upgrade to Organiser Account?",
      message: "Your account will be upgraded to an organiser account. You'll gain access to event creation and management features, along with your own organiser dashboard. You can continue using all regular user features as well.",
      confirmText: "Confirm Upgrade",
      onConfirm: async () => {
        const res = await becomeOrganizer();
        if (res.success) {
          setModalConfig({
            title: "Success!",
            message: "You are now an organiser! Welcome to the team.",
            confirmText: "Go to Dashboard",
            onConfirm: () => router.push('/organizer-dashboard'),
            showCancel: false,
            type: "success"
          });
        } else {
          setModalConfig({
            title: "Upgrade Failed",
            message: res.message || "Failed to upgrade role. Please try again later.",
            confirmText: "Close",
            onConfirm: () => setShowUpgradeModal(false),
            showCancel: false,
            type: "error"
          });
        }
      },
      showCancel: true,
      type: "info"
    });
    setShowUpgradeModal(true);
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const url = `${API_URL}/api/auth/update-profile`;
      console.log(`Calling ${url} with method POST`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });


      
      const contentType = response.headers.get("content-type");
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          updateUser(data);
          showAlert("Profile Updated", "Your profile has been updated successfully!", "success");
        } else {
          showAlert("Success", "Profile updated, but received non-JSON response from server.", "success");
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          showAlert("Update Failed", data.message || "Update failed", "error");
        } else {
          const errorText = await response.text();
          console.error("Server Error:", errorText);
          showAlert("Update Failed", `Update failed with status ${response.status}`, "error");
        }
      }
    } catch (error) {
      console.error(error);
      setModalConfig({
        title: "Error",
        message: "An error occurred while saving profile.",
        confirmText: "Close",
        onConfirm: () => setShowUpgradeModal(false),
        showCancel: false,
        type: "error"
      });
      setShowUpgradeModal(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to show success/error modal
  const showAlert = (title: string, message: string, type: "success" | "error" = "success") => {
    setModalConfig({
      title,
      message,
      confirmText: "Close",
      onConfirm: () => setShowUpgradeModal(false),
      showCancel: false,
      type
    });
    setShowUpgradeModal(true);
  };


  if (!user) return <div className="p-10 text-center">Please login to view profile</div>;

  return (
    <div className="space-y-6" suppressHydrationWarning>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 col-span-1 shadow-sm">
          <h2 className="font-bold text-gray-800 text-lg mb-6">Profile Photo</h2>

          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                <img
                  src={user.avatar || "/avatar.png"}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Camera Icon */}
              <div className="absolute bottom-1 right-1 bg-red-600 p-2 rounded-full cursor-pointer shadow-md border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M3 7h4l2-2h6l2 2h4v12H3V7z"
                  />
                </svg>
              </div>
            </div>

            {/* User Info */}
            <p className="mt-4 font-bold text-gray-900">
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>

            {/* Badge */}
            <span className="mt-2 text-[10px] font-bold bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
              {isOrganizer ? "Organiser" : "User"}
            </span>

            {/* Button */}
            {!isOrganizer && (
              <button 
                onClick={handleBecomeOrganizer} 
                className="mt-6 w-full border border-red-500 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition"
              >
                Become an Organiser
              </button>
            )}
            {isOrganizer && (
               <button 
                onClick={() => router.push('/organizer-dashboard')} 
                className="mt-6 w-full  text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition border border-red-500"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 col-span-2 shadow-sm">
          <h2 className="font-medium text-gray-800 text-lg">Personal Information</h2>
          <p className="text-sm text-gray-500 mb-8">
            Update your personal details
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 text-sm">
            <div className="mb-2">
              <p className="text-gray-600 text-xs font-medium uppercase mb-1.5">Full Name</p>
              <div className="flex gap-2">
                <input 
                    className="w-full border border-gray-300 focus:border-red-500 outline-none pb-1 font-medium text-gray-800 p-3 "
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                {/* <input 
                    className="w-full border-b border-gray-200 focus:border-red-500 outline-none pb-1 font-medium text-gray-800"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                /> */}
              </div>
            </div>
            <div className="mb-2">
              <p className="text-gray-500 text-xs font-medium uppercase mb-1.5">Email</p>
              <p className="font-medium text-gray-800 pb-1 border border-gray-300 p-3">{user.email}</p>
            </div>

            <div className="mb-2">
              <p className="text-gray-500 text-xs font-medium uppercase mb-1.5">Phone Number</p>
              <input 
                className="w-full border border-gray-200 focus:border-red-500 outline-none pb-1 font-medium text-gray-800 p-3"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-8 mb-2">
            <p className="text-gray-500 text-xs font-medium uppercase mb-1.5">Bio</p>
            <textarea 
              className="w-full border border-gray-200 rounded-lg p-3 focus:border-red-500 outline-none text-sm h-28 text-gray-700 leading-relaxed"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          {/* Button */}
          <button 
            disabled={isUpdating}
            onClick={handleSaveProfile}
            className={`mt-10 bg-red-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-100 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>

      </div>
      {/* Upgrade Modal */}
      <CustomModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
        type={modalConfig.type}
      />
    </div>
  );
}
