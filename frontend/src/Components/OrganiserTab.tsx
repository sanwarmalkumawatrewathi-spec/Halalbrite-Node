"use client";

import { FiEdit, FiTrash2, FiGlobe, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiLinkedin, FiLink } from "react-icons/fi";
import { IoBusinessOutline, IoLockClosedOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";

// Fallback categories if backend fails
const initialCategories = [
  "Conference", "Workshop", "Community",
  "Food Festival", "Educational", "Charity",
  "Outdoors", "Children", "Sports",
  "Youth", "University", "Career",
  "Retreat"
];

export default function OrganiserTab() {
  const [loading, setLoading] = useState(true);
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showSuggestInput, setShowSuggestInput] = useState(false);
  const [suggestedCategoryName, setSuggestedCategoryName] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    bio: '',
    categories: [] as string[],
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      otherWebsite: ''
    }
  });

  useEffect(() => {
    fetchOrganisations();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map(cat => cat.name));
          return;
        }
      }
      setCategories(initialCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories(initialCategories);
    }
  };

  const fetchOrganisations = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/organisations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Organisations API Error:", text);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setOrganisations(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch organisations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size (5MB)
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");

      setFormData(prev => ({ ...prev, logo: data.url }));
    } catch (error: any) {
      console.error("Logo upload error:", error);
      alert(`Upload failed: ${error.message || "Please try again."}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(category);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      website: '',
      bio: '',
      categories: [],
      socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '', otherWebsite: '' }
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (org: any) => {
    setFormData({
      name: org.name || '',
      logo: org.logo || '',
      website: org.website || '',
      bio: org.bio || '',
      categories: org.categories || [],
      socialLinks: {
        facebook: org.socialLinks?.facebook || '',
        instagram: org.socialLinks?.instagram || '',
        linkedin: org.socialLinks?.linkedin || '',
        twitter: org.socialLinks?.twitter || '',
        youtube: org.socialLinks?.youtube || '',
        otherWebsite: org.socialLinks?.otherWebsite || ''
      }
    });
    setEditingId(org._id);
    setIsFormOpen(true);
  };

  const handleDelete = (org: any) => {
    setOrgToDelete(org);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!orgToDelete) return;
    setIsDeleting(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/organisations/${orgToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setShowDeleteModal(false);
        setSuccessMessage("Organisation has been deleted successfully.");
        setShowSuccessModal(true);
        fetchOrganisations();
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsDeleting(false);
      setOrgToDelete(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (response.ok) {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setSuccessMessage("Your password has been changed successfully.");
          setShowSuccessModal(true);
        } else {
          alert(result.message || "Failed to change password");
        }
      } else {
        const errorText = await response.text();
        console.error("Server returned non-JSON response:", errorText);
        alert(`Server error (${response.status}). Please try again later.`);
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      alert(`Network error: ${error.message || "Please try again."}`);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const url = editingId
        ? `${API_URL}/api/dashboard/organizer/organisations/${editingId}`
        : `${API_URL}/api/dashboard/organizer/organisations`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.success) {
        resetForm();
        fetchOrganisations();
      } else {
        alert(result.message || 'Failed to save organisation');
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleSuggestCategory = async () => {
    if (!suggestedCategoryName.trim()) return;

    setIsSuggesting(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/suggest-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: suggestedCategoryName })
      });

      const result = await response.json();
      if (result.success) {
        const newCatName = result.data.name;
        setCategories(prev => [...prev, newCatName]);
        handleCategoryToggle(newCatName); // Auto-select it
        setSuggestedCategoryName("");
        setShowSuggestInput(false);
      } else {
        alert(result.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error suggesting category:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading organisations...</div>;

  return (
    <div className="max-w-full mx-auto p-0 space-y-6">
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white overflow-hidden w-full min-w-0">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 w-5 h-5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
              Organisation Profiles
            </h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">Manage your organisations that can be linked to events</p>
          </div>
          {!isFormOpen && (
            <button onClick={() => setIsFormOpen(true)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4 mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
              Add Organisation
            </button>
          )}
        </div>
        <div data-slot="card-content" className="px-6 [&amp;:last-child]:pb-6 p-6 pt-0">

          {isFormOpen && (
            <form onSubmit={handleSubmit} className="mb-8 bg-red-50/40 border border-red-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-red-900">{editingId ? 'Edit Organisation' : 'Add New Organisation'}</h3>
                <p className="text-sm text-red-700/70">Organisation profiles can be linked to events when creating them</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Organisation Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Islamic Conference Society"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Organisation Logo</label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white/50 cursor-pointer hover:border-red-400 hover:bg-red-50/20 transition-all group relative overflow-hidden ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center py-2">
                        <svg className="animate-spin h-8 w-8 text-red-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-sm font-bold text-red-900">Uploading logo...</p>
                      </div>
                    ) : formData.logo ? (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-xl border border-red-100 shadow-sm overflow-hidden mb-3 relative group">
                          <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-[10px] font-bold">CHANGE</span>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-red-600">Logo uploaded successfully!</p>
                        <p className="text-[10px] text-gray-400 mt-1">Click to change or edit URL below</p>
                      </div>
                    ) : (
                      <>
                        <IoBusinessOutline className="text-4xl text-gray-400 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                        <p className="text-sm font-bold text-gray-700">Drag and drop your logo here</p>
                        <p className="text-xs text-gray-500">or click to browse</p>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR USE URL</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste a URL to your organisation's logo</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourorganisation.com"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Organisation Bio *</label>
                  <textarea
                    name="bio"
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell attendees about your organisation..."
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">What Event Categories Do You Organise? *</label>
                  <p className="text-xs text-gray-500 mb-3">Select multiple categories that best describe your events</p>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${formData.categories.includes(cat) ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-400'}`}>
                            {formData.categories.includes(cat) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{cat}</span>
                          <input type="checkbox" className="hidden" checked={formData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                        </label>
                      ))}
                    </div>

                    {showSuggestInput ? (
                      <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl animate-in slide-in-from-top-2 duration-200">
                        <label className="block text-xs font-bold text-red-900 mb-2 uppercase tracking-wider">Suggest a New Category</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={suggestedCategoryName}
                            onChange={(e) => setSuggestedCategoryName(e.target.value)}
                            placeholder="Enter custom category name..."
                            className="flex-1 border border-red-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSuggestCategory}
                            disabled={isSuggesting || !suggestedCategoryName.trim()}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-red-700 transition flex items-center gap-2"
                          >
                            {isSuggesting ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "Add"}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowSuggestInput(false); setSuggestedCategoryName(""); }}
                            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-[10px] text-red-700/60 mt-2 italic">Suggest a category that isn't in our list. We'll review it for future use.</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowSuggestInput(true)}
                        className="mt-5 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 font-bold text-xs px-4 py-2 rounded-lg transition"
                      >
                        + Suggest New Category
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Social Media Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1"><FiFacebook className="text-[#1877F2]" /> Facebook</label>
                      <input type="url" name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} placeholder="https://facebook.com/yourpage" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1"><FiInstagram className="text-[#E4405F]" /> Instagram</label>
                      <input type="url" name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} placeholder="https://instagram.com/yourpage" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1"><FiLinkedin className="text-[#0A66C2]" /> LinkedIn</label>
                      <input type="url" name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} placeholder="https://linkedin.com/company/yourcompany" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1"><FiTwitter className="text-[#1DA1F2]" /> Twitter</label>
                      <input type="url" name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} placeholder="https://twitter.com/yourhandle" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1"><FiYoutube className="text-[#FF0000]" /> YouTube</label>
                      <input type="url" name="youtube" value={formData.socialLinks.youtube} onChange={handleSocialChange} placeholder="https://youtube.com/@yourchannel" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1"><FiLink className="text-gray-500" /> Other Website</label>
                      <input type="url" name="otherWebsite" value={formData.socialLinks.otherWebsite} onChange={handleSocialChange} placeholder="https://yourwebsite.com" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition">
                  {editingId ? 'Save Changes' : 'Add Organisation'}
                </button>
                <button type="button" onClick={resetForm} className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!isFormOpen && (
            <div className="space-y-4">
              {organisations.length > 0 ? (
                organisations.map((org, i) => (
                  <div key={i} className="w-full  rounded-xl p-5 flex flex-col sm:flex-row gap-5 border border-gray-200 items-start hover:bg-gray-50/50 hover:shadow-sm transition-all bg-white">
                    <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 text-xl font-bold shadow-sm overflow-hidden">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt=""
                          className="w-full h-full rounded-xl object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-svg')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`lucide lucide-building2 lucide-building-2 w-10 h-10 text-red-600 fallback-svg ${org.logo ? 'hidden' : ''}`}
                      >
                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                        <path d="M10 6h4"></path>
                        <path d="M10 10h4"></path>
                        <path d="M10 14h4"></path>
                        <path d="M10 18h4"></path>
                      </svg>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{org.name || org.username}</h3>
                          {org.website && (
                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 font-medium flex items-center gap-1 mt-0.5 hover:underline w-fit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                              {org.website}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button onClick={() => handleEdit(org)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md bg-transparent text-gray-500 border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit w-4 h-4"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"></path></svg>
                            <span className="sr-only">Edit</span>
                          </button>
                          <button onClick={() => handleDelete(org)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md bg-transparent text-red-500 border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{org.bio || org.description || 'No description provided for this organisation.'}</p>

                      {org.categories && org.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {org.categories.map((cat: string) => (
                            <span key={cat} data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden text-foreground bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent">{cat}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100">
                        <div className="flex gap-3 text-gray-400">
                          {org.socialLinks?.facebook && <a href={org.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-[#1877F2] transition"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>}
                          {org.socialLinks?.twitter && <a href={org.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-[#1DA1F2] transition"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>}
                          {org.socialLinks?.linkedin && <a href={org.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#0A66C2] transition"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>}
                          {org.socialLinks?.instagram && <a href={org.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-[#E4405F] transition"><FiInstagram className="w-4 h-4" /></a>}
                          {org.socialLinks?.youtube && <a href={org.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-[#FF0000] transition"><FiYoutube className="w-4 h-4" /></a>}
                          {org.socialLinks?.otherWebsite && <a href={org.socialLinks.otherWebsite} target="_blank" rel="noreferrer" className="hover:text-gray-700 transition"><FiLink className="w-4 h-4" /></a>}

                          {!org.socialLinks?.facebook && !org.socialLinks?.instagram && !org.socialLinks?.linkedin && !org.socialLinks?.twitter && !org.socialLinks?.youtube && !org.socialLinks?.otherWebsite && (
                            <span className="text-xs italic text-gray-400">No social links</span>
                          )}
                        </div>
                        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-3 h-3"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                          Created on {new Date(org.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                  <IoBusinessOutline className="text-4xl text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No organisations found.</p>
                  <p className="text-xs text-gray-400 mt-1">Add an organisation to start branding your events.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white overflow-hidden w-full min-w-0">
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-red-50 text-red-600 rounded-lg">
                <IoLockClosedOutline className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500 mt-1">Update your account password to keep your account secure</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              data-slot="button"
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-9 px-4 py-2 border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:w-auto rounded-md shadow-sm"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FiTrash2 className="text-red-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Organisation?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{orgToDelete?.name}"</span>? This action cannot be undone and all associated events will lose this profile link.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <IoLockClosedOutline className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isUpdatingPassword ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600 w-10 h-10"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-8">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}