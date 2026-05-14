import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useState, useRef } from "react";
import CustomModal from "./CustomModal";
import { getImageUrl } from "@/utils/imageUtils";

export default function ProfileTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const router = useRouter();
  const { user, isOrganizer, becomeOrganizer, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "+44 7700 900000",
    bio: user?.bio || "",
    username: user?.username || ""
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    onConfirm: () => { },
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 1. Immediate local preview
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl);

      // 2. Upload to server
      try {
        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const token = localStorage.getItem('token');
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        const response = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });

        const data = await response.json();
        if (response.ok && data.url) {
          // Update user profile with new avatar URL
          const updateRes = await fetch(`${API_URL}/api/auth/update-profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ avatar: data.url })
          });
          if (updateRes.ok) {
            const updatedUser = await updateRes.json();
            updateUser(updatedUser.data || updatedUser);
          }
        }
      } catch (error) {
        console.error("Avatar upload failed:", error);
      }
    }
  };


  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const url = `${API_URL}/api/auth/update-profile`;

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
          updateUser({ ...data, avatar: avatarPreview || data.avatar });
          showAlert("Profile Updated", "Your profile has been updated successfully!", "success");
        } else {
          showAlert("Success", "Profile updated, but received non-JSON response from server.", "success");
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          showAlert("Update Failed", data.message || "Update failed", "error");
        } else {
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
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-20">
        {/* Profile Photo Card */}
        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border md:col-span-1">
          <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-4 sm:p-6">
            <h4 data-slot="card-title" className="text-lg sm:text-xl">Profile Photo</h4>
          </div>
          <div data-slot="card-content" className="flex flex-col items-center [&:last-child]:pb-6 p-4 sm:p-6">
            <div className="relative">
              <span data-slot="avatar" className="relative flex shrink-0 overflow-hidden rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-100 border border-gray-200">
                {(avatarPreview || user.avatar) ? (
                  <img
                    data-slot="avatar-image"
                    className="aspect-square w-full h-full object-cover"
                    src={getImageUrl(avatarPreview || user.avatar)}
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-4xl sm:text-5xl md:text-6xl">
                    {user.username ? user.username.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                )}
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                data-slot="button"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 absolute bottom-0 right-0 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 bg-red-600 hover:bg-red-700 text-white shadow-md border-2 border-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera w-4 h-4 sm:w-5 sm:h-5">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </button>
            </div>
            <div className="mt-3 sm:mt-4 text-center w-full">
              <p className="text-gray-900 text-base sm:text-lg font-semibold">
                {user.username}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
              <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap overflow-hidden border-transparent mt-2 bg-red-600 text-white text-xs sm:text-sm uppercase tracking-wider">
                {isOrganizer ? "Organiser" : "User"}
              </span>

              {!isOrganizer && (
                <button
                  onClick={handleBecomeOrganizer}
                  data-slot="button"
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 h-8 rounded-md px-3 mt-3 w-full border border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                >
                  Become an Organiser
                </button>
              )}
              {isOrganizer && (
                <button
                  onClick={() => router.push('/organizer-dashboard')}
                  data-slot="button"
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 h-8 rounded-md px-3 mt-3 w-full border border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border md:col-span-2">
          <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-4 sm:p-6">
            <h4 data-slot="card-title" className="text-lg sm:text-xl">Personal Information</h4>
            <p data-slot="card-description" className="text-gray-500 text-sm">Update your personal details</p>
          </div>
          <div data-slot="card-content" className="[&:last-child]:pb-6 p-4 sm:p-6">
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSaveProfile}>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-1.5 sm:space-y-2">
                  <label data-slot="label" className="flex items-center gap-2 font-medium text-sm text-gray-700" htmlFor="username">Username</label>
                  <input
                    data-slot="input"
                    className="flex h-9 w-full min-w-0 rounded-md border border-gray-300 px-3 py-1 bg-white outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-sm sm:text-base text-gray-900"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label data-slot="label" className="flex items-center gap-2 font-medium text-sm text-gray-700" htmlFor="email">Email</label>
                  <input
                    type="email"
                    data-slot="input"
                    className="flex h-9 w-full min-w-0 rounded-md border border-gray-300 px-3 py-1 bg-gray-50 outline-none cursor-not-allowed text-sm sm:text-base text-gray-500"
                    id="email"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label data-slot="label" className="flex items-center gap-2 font-medium text-sm text-gray-700" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  data-slot="input"
                  className="flex h-9 w-full min-w-0 rounded-md border border-gray-300 px-3 py-1 bg-white outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-sm sm:text-base text-gray-900"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label data-slot="label" className="flex items-center gap-2 font-medium text-sm text-gray-700" htmlFor="bio">Bio</label>
                <input
                  data-slot="input"
                  className="flex h-9 w-full min-w-0 rounded-md border border-gray-300 px-3 py-1 bg-white outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-sm sm:text-base text-gray-900"
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <button
                data-slot="button"
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-white h-9 px-4 py-2 bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm sm:text-base ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>
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
