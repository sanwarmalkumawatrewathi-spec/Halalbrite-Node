import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

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

  const handleBecomeOrganizer = async () => {
    if (confirm("Are you sure you want to become an organiser?")) {
      const res = await becomeOrganizer();
      if (res.success) {
        alert("You are now an organiser!");
      } else {
        alert(res.message || "Failed to upgrade role");
      }
    }
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
          alert("Profile updated successfully!");
        } else {
          alert("Profile updated, but received non-JSON response from server.");
        }
      } else {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          alert(data.message || "Update failed");
        } else {
          const errorText = await response.text();
          console.error("Server Error:", errorText);
          alert(`Update failed with status ${response.status}. Check console for details.`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving profile.");
    } finally {
      setIsUpdating(false);
    }
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
                onClick={() => router.push('/OrganiserDashboard')} 
                className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 col-span-2 shadow-sm">
          <h2 className="font-bold text-gray-800 text-lg">Personal Information</h2>
          <p className="text-sm text-gray-500 mb-8">
            Update your personal details
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 text-sm">
            <div className="mb-2">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1.5">Full Name</p>
              <div className="flex gap-2">
                <input 
                    className="w-full border-b border-gray-200 focus:border-red-500 outline-none pb-1 font-medium text-gray-800"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                <input 
                    className="w-full border-b border-gray-200 focus:border-red-500 outline-none pb-1 font-medium text-gray-800"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-2">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1.5">Email</p>
              <p className="font-medium text-gray-800 pb-1 border-b border-transparent">{user.email}</p>
            </div>

            <div className="mb-2">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1.5">Phone Number</p>
              <input 
                className="w-full border-b border-gray-200 focus:border-red-500 outline-none pb-1 font-medium text-gray-800"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-8 mb-2">
            <p className="text-gray-400 text-xs font-bold uppercase mb-1.5">Bio</p>
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
      {/* 🔥 Address Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-bold text-gray-800">Saved Addresses</h2>
            <p className="text-sm text-gray-500">
              Manage your billing and shipping addresses
            </p>
          </div>

          <button className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition">
            + Add New Address
          </button>
        </div>

        {/* Address Cards */}
        <div className="space-y-4">
          {(user?.addresses?.length ?? 0) > 0 ? (
            user.addresses.map((addr: any, i: number) => (
              <div key={i} className="border border-gray-100 bg-gray-50/30 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-red-200 transition">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500 space-y-0.5">
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.zipCode}</p>
                        <p>{addr.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition bg-white shadow-sm">
                    Edit
                  </button>
                  <button className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition bg-white shadow-sm">
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No addresses saved yet.</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50/50 border border-blue-100 text-blue-800 text-[11px] p-4 rounded-xl flex items-start gap-3">
          <span className="bg-blue-100 text-blue-800 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </span>
          <div className="space-y-1">
            <p className="font-bold">About Saved Addresses</p>
            <p className="opacity-80">Your addresses are securely stored and will be used to auto-fill billing info during checkout. Setting a default address will automatically use it for future ticket purchases.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
