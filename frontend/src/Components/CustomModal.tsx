"use client";

import { useEffect, useState } from "react";
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export default function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
}: CustomModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="w-12 h-12 text-green-500" />;
      case "warning":
        return <FiAlertCircle className="w-12 h-12 text-yellow-500" />;
      case "error":
        return <FiAlertCircle className="w-12 h-12 text-red-500" />;
      default:
        return (
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-lg p-8 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {getIcon()}
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {title}
          </h2>
          
          <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-[90%] mx-auto">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {showCancel && (
              <button
                onClick={onClose}
                className="order-2 sm:order-1 flex-1 py-4 px-6 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200 text-lg shadow-sm"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                else onClose();
              }}
              className="order-1 sm:order-2 flex-1 py-4 px-6 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-200 text-lg shadow-lg shadow-red-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
