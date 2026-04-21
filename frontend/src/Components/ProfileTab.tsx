import { useRouter } from "next/navigation";
 export default function ProfileTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const router = useRouter()
  return (
    <div className="space-y-6">

      {/* Top Section (your profile UI) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* Left Card */}
   <div className="bg-white border border-gray-200 rounded-xl p-6 col-span-1">
   <h2 className="font-semibold text-lg mb-6">Profile Photo</h2>

  <div className="flex flex-col items-center">

      {/* Avatar with camera icon */}
    <div className="relative w-32 h-32">
  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
       <img
            src="/avatar.png"
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>

         {/* Camera Icon */}
       <div className="absolute bottom-1 right-1 bg-red-600 p-2 rounded-full cursor-pointer shadow-md">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7h4l2-2h6l2 2h4v12H3V7z"
            />
          </svg>
        </div>
      </div>

      {/* User Info */}
      <p className="mt-4 font-semibold text-gray-800">
        Ahmed Hassan
      </p>
      <p className="text-sm text-gray-500">
        ahmed@example.com
      </p>

     {/* Badge */}
      <span className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded-full">user
      </span>

      {/* Button */}
     <button onClick={() => setActiveTab("settings")} className="mt-5 w-full border border-red-500 text-red-500 py-2 rounded-md text-sm hover:bg-red-50 transition">
       Become an Organiser
     </button>
   </div>
 </div>

 {/* Right Card */}
  <div className="bg-white border border-gray-200 rounded-xl p-6 col-span-2">
   <h2 className="font-semibold text-lg">Personal Information</h2>
   <p className="text-sm text-gray-500 mb-22">
     Update your personal details
   </p>

    {/* Info Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 text-sm">

       <div className="mb-2">
       <p className="text-gray-500 mb-2.5">Full Name</p>
       <p className="font-medium text-gray-800">Ahmed Hassan</p>
     </div>
      <div className="mb-2">
        <p className="text-gray-500 mb-2.5">Email</p>
          <p className="font-medium text-gray-800">ahmed@example.com</p>
      </div>

      <div className="mb-2">
       <p className="text-gray-500 mb-2.5">Phone Number</p>
       <p className="font-medium text-gray-800">+44 7700 900000</p>
      </div>

      

    </div>

   <div className="grid-cols-1 mt-2.5 mb-2">
        <p className="text-gray-500 mb-2.5">Bio</p>
      <p className="font-medium text-gray-400">
         Tell us about yourself...
        </p>
       </div>

     {/* Button */}
    <button className="mt-8 bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition">
     Save Changes
 </button>
 </div>

 </div>
      {/* 🔥 Address Section */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Saved Addresses</h2>
            <p className="text-sm text-gray-500">
              Manage your billing and shipping addresses
            </p>
          </div>

          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
            + Add New Address
          </button>
        </div>

        {/* Address Card 1 */}
        <div className="border border-gray-300 hover:border-red-500 rounded-lg p-4 flex justify-between items-start mb-4">
          
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white text-sm">
              🏠
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">John Doe</p>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                  Default
                </span>
              </div>

              <p className="text-sm text-gray-500">123 Main Street</p>
              <p className="text-sm text-gray-500">Apt 4B</p>
              <p className="text-sm text-gray-500">London, SW1A 1AA</p>
              <p className="text-sm text-gray-500">United Kingdom</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="text-sm px-3 py-1 border rounded-md">
              Edit
            </button>
            <button className="text-sm px-3 py-1 border text-red-600 rounded-md">
              Remove
            </button>
          </div>
        </div>

        {/* Address Card 2 */}
        <div className="border border-gray-300 hover:border-red-500 rounded-lg p-4 flex justify-between items-start">
          
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white text-sm">
              🏠
            </div>

            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">456 High Street</p>
              <p className="text-sm text-gray-500">Manchester, M1 1AE</p>
              <p className="text-sm text-gray-500">United Kingdom</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 border text-red-600 rounded-md">
              Set Default
            </button>
            <button className="text-xs px-3 py-1 border rounded-md">
              Edit
            </button>
            <button className="text-xs px-3 py-1 border text-red-600 rounded-md">
              Remove
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs p-3 rounded-md">
          Your addresses are securely stored and will be used to auto-fill billing info during checkout.
          <p>Setting a default address will automatically use it for future ticket purchases.</p>
        </div>

      </div>
    </div>
  );
}
