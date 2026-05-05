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
    <div className="max-w-full mx-auto p-0 space-y-6">
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white overflow-hidden w-full min-w-0">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900 font-semibold text-lg flex items-center gap-2">
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
                  <div key={i} className="w-full border rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-start hover:bg-gray-50/50 hover:shadow-sm transition-all bg-white">
                    <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 text-xl font-bold shadow-sm">
                      {org.logo ? (
                        <img src={org.logo} alt="" className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 w-6 h-6"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                      )}
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
                          <button onClick={() => handleDelete(org._id)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md bg-transparent text-red-500 border border-gray-200">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-5 h-5"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6.5 2a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your account security, passwords, and two-factor authentication</p>
              </div>
            </div>
            <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:w-auto rounded-md">
              Manage Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}