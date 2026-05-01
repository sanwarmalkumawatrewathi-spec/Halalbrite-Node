"use client";

import { FiEdit, FiTrash2, FiGlobe, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiLinkedin, FiLink } from "react-icons/fi";
import { IoBusinessOutline, IoLockClosedOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";

const categoriesList = [
  "Conference", "Workshop", "Community",
  "Food Festival", "Educational", "Charity",
  "Outdoors", "Children", "Sports",
  "Youth", "University", "Career",
  "Retreat"
];

export default function OrganiserTab() {
  const [loading, setLoading] = useState(true);
  const [organisations, setOrganisations] = useState<any[]>([]);

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
  }, []);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organisation?')) return;

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/organisations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        fetchOrganisations();
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (error) {
      console.error("Error deleting:", error);
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

  if (loading) return <div className="p-10 text-center">Loading organisations...</div>;

  return (
    <div className="max-w-7xl mx-auto p-0 space-y-6">
      {/* Organisation Profiles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <IoBusinessOutline className="text-red-700" /> Organisation Profiles
            </h2>
            <p className="text-sm text-gray-500">
              Manage your organisations that can be linked to events
            </p>
          </div>

          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition"
            >
              + Add Organisation
            </button>
          )}
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-10 bg-red-50/40 border border-red-100 rounded-2xl p-8 space-y-6">
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
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white/50">
                  <IoBusinessOutline className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">Drag and drop your logo here</p>
                  <p className="text-xs text-gray-500">or click to browse</p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">PNG, JPG, GIF up to 5MB</p>
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
                    {categoriesList.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${formData.categories.includes(cat) ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-400'}`}>
                          {formData.categories.includes(cat) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{cat}</span>
                        <input type="checkbox" className="hidden" checked={formData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                      </label>
                    ))}
                  </div>
                  <button type="button" className="mt-5 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 font-bold text-xs px-4 py-2 rounded-lg transition">
                    + Suggest New Category
                  </button>
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
                <div
                  key={i}
                  className="border border-gray-50 bg-gray-50/30 rounded-xl p-5 flex gap-5 items-start hover:bg-white hover:shadow-sm hover:border-gray-100 transition"
                >
                  {/* Icon/Logo */}
                  <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 text-xl font-bold shadow-sm">
                    {org.logo ? (
                      <img src={org.logo} alt="" className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <IoBusinessOutline />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{org.name || org.username}</h3>
                        {org.website && (
                          <p className="text-sm text-red-600 font-medium flex items-center gap-1 mt-0.5">
                            <FiGlobe className="text-xs" /> {org.website}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(org)} className="flex items-center gap-1.5 border border-gray-100 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:text-gray-900 hover:border-gray-200 transition shadow-sm">
                          <FiEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(org._id)} className="flex items-center gap-1.5 border border-red-50 border-red-50 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:text-red-700 hover:border-red-100 transition shadow-sm">
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      {org.bio || org.description || 'No description provided for this organisation.'}
                    </p>

                    {org.categories && org.categories.length > 0 && (
                      <p className="text-xs text-gray-600 mt-2 font-medium">
                        Event Categories: <span className="font-normal">{org.categories.join(', ')}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-4 items-center">
                      {/* Social Icons */}
                      <div className="flex gap-4 text-gray-400">
                        {org.socialLinks?.facebook && <a href={org.socialLinks.facebook} target="_blank" rel="noreferrer"><FiFacebook className="cursor-pointer hover:text-[#1877F2] transition" /></a>}
                        {org.socialLinks?.instagram && <a href={org.socialLinks.instagram} target="_blank" rel="noreferrer"><FiInstagram className="cursor-pointer hover:text-[#E4405F] transition" /></a>}
                        {org.socialLinks?.linkedin && <a href={org.socialLinks.linkedin} target="_blank" rel="noreferrer"><FiLinkedin className="cursor-pointer hover:text-[#0A66C2] transition" /></a>}
                        {org.socialLinks?.twitter && <a href={org.socialLinks.twitter} target="_blank" rel="noreferrer"><FiTwitter className="cursor-pointer hover:text-[#1DA1F2] transition" /></a>}
                        {org.socialLinks?.youtube && <a href={org.socialLinks.youtube} target="_blank" rel="noreferrer"><FiYoutube className="cursor-pointer hover:text-[#FF0000] transition" /></a>}
                        {org.socialLinks?.otherWebsite && <a href={org.socialLinks.otherWebsite} target="_blank" rel="noreferrer"><FiLink className="cursor-pointer hover:text-gray-700 transition" /></a>}

                        {!org.socialLinks?.facebook && !org.socialLinks?.instagram && !org.socialLinks?.linkedin && !org.socialLinks?.twitter && !org.socialLinks?.youtube && !org.socialLinks?.otherWebsite && (
                          <span className="text-xs italic text-gray-400">No social links</span>
                        )}
                      </div>

                      <div className="h-4 w-px bg-gray-200 ml-2 hidden sm:block"></div>

                      <p className="text-xs text-gray-400 font-medium">
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

      {/* Security Info Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-0">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <IoLockClosedOutline className="text-red-500" /> Security
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account security and authentication settings
          </p>
          <button className="mt-4 text-sm font-bold text-red-600 hover:underline">
            Go to Security Settings →
          </button>
        </div>
      </div>
    </div>
  );
}