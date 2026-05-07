"use client";

import React, { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventUrl: string;
}

export default function ShareModal({ isOpen, onClose, eventTitle, eventUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Lock scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shareOptions = [
    { 
      name: 'Facebook', 
      icon: <FaFacebookF className="w-5 h-5 text-[#1877F2]" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}` 
    },
    { 
      name: 'X (Twitter)', 
      icon: <FaXTwitter className="w-5 h-5 text-black" />, 
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventTitle)}&url=${encodeURIComponent(eventUrl)}` 
    },
    { 
      name: 'LinkedIn', 
      icon: <FaLinkedinIn className="w-5 h-5 text-[#0A66C2]" />, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}` 
    },
    { 
      name: 'WhatsApp', 
      icon: <FaWhatsapp className="w-5 h-5 text-[#25D366]" />, 
      url: `https://wa.me/?text=${encodeURIComponent(`${eventTitle} - ${eventUrl}`)}` 
    },
    { 
      name: 'Instagram', 
      icon: <FaInstagram className="w-5 h-5 text-[#E4405F]" />, 
      url: `https://www.instagram.com/` 
    },
    { 
      name: 'TikTok', 
      icon: <FaTiktok className="w-5 h-5 text-black" />, 
      url: `https://www.tiktok.com/` 
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="text-center w-full">
            <h2 className="text-xl font-bold text-gray-900">Share Event</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Share this event with your friends and followers</p>
          </div>
          <button 
            onClick={onClose} 
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                {option.icon}
              </div>
              <span className="font-semibold text-gray-700 text-sm">{option.name}</span>
            </a>
          ))}

          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or copy link</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 group-hover:bg-red-100 transition-all">
              <LinkIcon className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-semibold text-gray-700 text-sm flex-1 text-left">
              {copied ? 'Link Copied!' : 'Copy Link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
