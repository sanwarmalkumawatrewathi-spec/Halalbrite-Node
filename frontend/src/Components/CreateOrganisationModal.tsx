"use client";

import { useState, useEffect, useRef } from "react";
import { FiGlobe, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiLinkedin, FiLink, FiX } from "react-icons/fi";
import { IoBusinessOutline } from "react-icons/io5";

interface CreateOrganisationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOrg: any) => void;
}

const initialCategories = [
  "Conference", "Workshop", "Community",
  "Food Festival", "Educational", "Charity",
  "Outdoors", "Children", "Sports",
  "Youth", "University", "Career",
  "Retreat"
];

export default function CreateOrganisationModal({ isOpen, onClose, onSuccess }: CreateOrganisationModalProps) {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestCategory, setShowSuggestCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    bio: '',
    country: '',
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
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
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
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");
      setFormData(prev => ({ ...prev, logo: data.url }));
      setError(null);
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.categories.length === 0) {
      setError("Please select at least one category.");
      setLoading(false);
      return;
    }

    const normalizeUrl = (url: string) => {
      if (!url || url.trim() === "") return "";
      const trimmed = url.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('blob:')) {
        return trimmed;
      }
      return `https://${trimmed}`;
    };

    const normalizedData = {
      ...formData,
      website: normalizeUrl(formData.website),
      logo: normalizeUrl(formData.logo),
      socialLinks: {
        facebook: normalizeUrl(formData.socialLinks.facebook),
        instagram: normalizeUrl(formData.socialLinks.instagram),
        linkedin: normalizeUrl(formData.socialLinks.linkedin),
        twitter: normalizeUrl(formData.socialLinks.twitter),
        youtube: normalizeUrl(formData.socialLinks.youtube),
        otherWebsite: normalizeUrl(formData.socialLinks.otherWebsite)
      }
    };

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/organisations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(normalizedData)
      });

      const result = await response.json();
      if (result.success) {
        onSuccess(result.data);
        onClose();
      } else {
        setError(result.message || 'Failed to save organisation');
      }
    } catch (err) {
      console.error("Error saving:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestCategory = async () => {
    const categoryToAdd = newCategoryName.trim();
    if (!categoryToAdd) return;
    
    // Update both states simultaneously
    setCategories(prev => {
      if (!prev.includes(categoryToAdd)) return [...prev, categoryToAdd];
      return prev;
    });

    setFormData(prev => {
      if (!prev.categories.includes(categoryToAdd)) {
        return {
          ...prev,
          categories: [...prev.categories, categoryToAdd]
        };
      }
      return prev;
    });

    // Reset UI
    setNewCategoryName("");
    setShowSuggestCategory(false);

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/suggest-category`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: categoryToAdd })
      });

      if (response.ok) {
        // Option: Show a small toast or just close the box
        setNewCategoryName("");
        setShowSuggestCategory(false);
      }
    } catch (error) {
      console.error("Error suggesting category:", error);
      // Still allow the UI addition even if backend call fails for now
      setNewCategoryName("");
      setShowSuggestCategory(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
          <div>
            <h3 className="text-2xl font-bold text-red-900">Add New Organisation</h3>
            <p className="text-sm text-red-700/70">Create a professional profile for your events</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full transition-colors">
            <FiX className="text-2xl text-red-900" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          <form id="org-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            
            <div className="space-y-8">
              {/* Basic Info - Single Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Organisation Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Islamic Conference Society"
                    className="w-full border bg-gray-50/50 border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Organisation Logo</label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/30 cursor-pointer hover:border-red-400 hover:bg-red-50/20 transition-all group relative overflow-hidden ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center py-2">
                        <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mb-2"></div>
                        <p className="text-sm font-bold text-red-900">Uploading...</p>
                      </div>
                    ) : formData.logo ? (
                      <div className="flex flex-col items-center">
                        <img src={formData.logo.startsWith('http') ? formData.logo : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}${formData.logo}`} alt="Preview" className="w-24 h-24 rounded-2xl object-cover mb-3 shadow-md" />
                        <p className="text-xs font-bold text-red-600">Click to change logo</p>
                      </div>
                    ) : (
                      <>
                        <IoBusinessOutline className="text-4xl text-gray-300 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                        <p className="text-sm font-bold text-gray-600">Click to upload logo</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="yourorganisation.com"
                    className="w-full border bg-gray-50/50 border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Country *</label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border bg-gray-50/50 border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  >
                    <option value="">Select a country</option>
                    <optgroup label="Europe">
                      <option value="IE">Ireland</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                      <option value="IT">Italy</option>
                      <option value="NL">Netherlands</option>
                      <option value="AT">Austria</option>
                      <option value="BE">Belgium</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="NO">Norway</option>
                      <option value="PT">Portugal</option>
                      <option value="SE">Sweden</option>
                      <option value="CH">Switzerland</option>
                    </optgroup>
                    <optgroup label="North America">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </optgroup>
                    <optgroup label="Oceania">
                      <option value="AU">Australia</option>
                      <option value="NZ">New Zealand</option>
                    </optgroup>
                  </select>
                </div>
              </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Organisation Bio *</label>
                  <textarea
                    name="bio"
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell attendees about your organisation and its mission..."
                    className="w-full border bg-gray-50/50 border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">What Event Categories Do You Organise? *</label>
                  <p className="text-[10px] text-gray-500 mb-4 font-medium">Select multiple categories that best describe your events</p>
                  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${formData.categories.includes(cat) ? 'bg-red-600 border-red-600 shadow-md shadow-red-200' : 'bg-white border-gray-200 group-hover:border-red-300'}`}>
                            {formData.categories.includes(cat) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className={`text-xs font-bold transition-colors ${formData.categories.includes(cat) ? 'text-gray-900' : 'text-gray-600 group-hover:text-red-600'}`}>{cat}</span>
                          <input type="checkbox" className="hidden" checked={formData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSuggestCategory(true)}
                      className="mt-8 bg-red-50 text-red-600 px-5 py-2 rounded-xl text-[10px] font-bold border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                      <span className="text-lg">+</span> Suggest New Category
                    </button>

                    {showSuggestCategory && (
                      <div className="mt-6 bg-red-50/50 border border-red-100 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-300">
                        <label className="block text-[10px] font-bold text-red-900 mb-3 uppercase tracking-widest">Suggest a New Category</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter custom category name..."
                            className="flex-1 bg-white border-2 border-red-200 rounded-xl px-4 py-2 text-sm focus:border-red-500 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleSuggestCategory}
                            className="bg-red-400 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-red-500 transition-all shadow-sm"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSuggestCategory(false)}
                            className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="mt-3 text-[10px] text-red-700/60 font-medium italic">Suggest a category that isn't in our list. We'll review it for future use.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            {/* Social Media Section */}
            <div className="bg-gray-50/30 border border-gray-100 rounded-3xl p-6">
              <label className="block text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                Social Media Links
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider"><FiFacebook className="text-[#1877F2]" /> Facebook</label>
                  <input type="text" name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} placeholder="facebook.com/yourpage" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider"><FiInstagram className="text-[#E4405F]" /> Instagram</label>
                  <input type="text" name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} placeholder="@yourpage" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider"><FiLinkedin className="text-[#0A66C2]" /> LinkedIn</label>
                  <input type="text" name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} placeholder="linkedin.com/company/page" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider"><FiTwitter className="text-[#1DA1F2]" /> Twitter</label>
                  <input type="text" name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} placeholder="@handle" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider"><FiYoutube className="text-[#FF0000]" /> YouTube</label>
                  <input type="text" name="youtube" value={formData.socialLinks.youtube} onChange={handleSocialChange} placeholder="youtube.com/@channel" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider"><FiLink className="text-gray-500" /> Other Link</label>
                  <input type="text" name="otherWebsite" value={formData.socialLinks.otherWebsite} onChange={handleSocialChange} placeholder="yourwebsite.com" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-4 bg-gray-50">
          <button
            type="submit"
            form="org-form"
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Creating Organisation..." : "Add Organisation"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
