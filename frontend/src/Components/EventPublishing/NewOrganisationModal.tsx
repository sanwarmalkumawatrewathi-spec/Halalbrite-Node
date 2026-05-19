"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoBusinessOutline } from "react-icons/io5";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiYoutube, FiLink } from "react-icons/fi";

interface NewOrganisationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (org: any) => void;
}

export default function NewOrganisationModal({ isOpen, onClose, onSuccess }: NewOrganisationModalProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<string[]>([]);

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
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
                const res = await fetch(`${baseUrl}/api/categories`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data.map(c => c.name));
                }
            } catch (error) {
                console.error("❌ Failed to fetch categories:", error);
            }
        };
        if (isOpen) fetchCategories();
    }, [isOpen]);

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
        } catch (error: any) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Normalize URLs
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

        setIsSaving(true);
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
            } else {
                alert(result.message || 'Failed to save organisation');
            }
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-24 pb-8 bg-black/55 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 rounded-[2rem] w-full max-w-2xl max-h-[calc(100vh-140px)] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 rounded-t-[2rem]">
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Create Organisation Profile</h3>
                        <p className="text-xs text-red-700/70">This profile will be shown as the event organiser</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-red-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organisation Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Islamic Conference Society"
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organisation Logo</label>
                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            <div
                                onClick={() => logoInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-gray-50/30 cursor-pointer hover:border-red-400 hover:bg-red-50/20 transition-all group"
                            >
                                {isUploading ? (
                                    <div className="animate-spin h-6 w-6 border-4 border-red-600 border-t-transparent rounded-full mx-auto" />
                                ) : formData.logo ? (
                                    <img src={getImageUrl(formData.logo)} alt="Logo" className="w-20 h-20 object-cover rounded-2xl mx-auto border border-gray-100 shadow-sm" />
                                ) : (
                                    <>
                                        <IoBusinessOutline className="text-3xl text-gray-300 mx-auto mb-1 group-hover:text-red-500 transition-colors" />
                                        <p className="text-xs font-bold text-gray-600">Upload logo</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organisation Bio *</label>
                            <textarea
                                name="bio"
                                required
                                rows={3}
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell attendees about your organisation..."
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none resize-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Categories</label>
                            <div className="flex flex-wrap gap-1.5">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleCategoryToggle(cat)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${formData.categories.includes(cat) ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider"><FiFacebook className="text-[#1877F2]" /> Facebook</label>
                                <input type="text" name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} placeholder="facebook.com/yourpage" className="w-full border borborder border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all" />
                            </div>
                            <div>
                                <label className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider"><FiInstagram className="text-[#E4405F]" /> Instagram</label>
                                <input type="text" name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} placeholder="instagram.com/yourpage" className="w-full border borborder border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 py-4">
                        <button type="submit" disabled={isSaving} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-100 hover:bg-red-700 transition disabled:opacity-50 active:scale-[0.98]">
                            {isSaving ? "Saving..." : "Create Profile"}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-[0.98]">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
