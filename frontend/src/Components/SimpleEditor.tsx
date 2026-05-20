"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

// Icons
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";

export default function SimpleEditor({
  onChange,
  initialValue,
}: {
  onChange: (value: string) => void;
  initialValue?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [bubblePos, setBubblePos] = useState<{ top: number; left: number; isFlipped: boolean } | null>(null);

  // Sync popover input text with existing link href if cursor is on a link
  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => {
      if (editor.isActive("link")) {
        setLinkUrl(editor.getAttributes("link").href || "");
      }
    };
    editor.on("selectionUpdate", updateHandler);
    return () => {
      editor.off("selectionUpdate", updateHandler);
    };
  }, [editor]);

  // Track selection coordinates for custom bubble positioning only when popover is open
  useEffect(() => {
    if (!editor) return;
    
    const updateHandler = () => {
      if (isLinkPopoverOpen) {
        const { view } = editor;
        try {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const domRange = domSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            const containerEl = document.getElementById("simple-editor-container");
            if (containerEl) {
              const containerRect = containerEl.getBoundingClientRect();
              
              // Position bubble directly ABOVE the selection rect
              let top = rect.top - containerRect.top - 65;
              let left = Math.max(10, Math.min(containerRect.width - 300, rect.left - containerRect.left + (rect.width / 2) - 144));
              let isFlipped = true; // arrow points down from bottom
              
              // If positioned too high (overlapping the toolbar), render below the selection instead
              if (top < 45) {
                top = rect.bottom - containerRect.top + 10;
                isFlipped = false; // arrow points up from top
              }
              
              // Fallback below the toolbar if selection coordinates are invalid
              if (rect.top === 0 && rect.bottom === 0) {
                top = 50;
                left = Math.max(10, containerRect.width / 2 - 144);
                isFlipped = false;
              }

              setBubblePos({ top, left, isFlipped });
              return;
            }
          }
        } catch (e) {
          // Fail-safe fallback
        }
      }
      setBubblePos(null);
    };

    // Execute positioning calculation immediately when popover state changes
    updateHandler();

    editor.on("selectionUpdate", updateHandler);
    editor.on("update", updateHandler);
    return () => {
      editor.off("selectionUpdate", updateHandler);
      editor.off("update", updateHandler);
    };
  }, [editor, isLinkPopoverOpen]);

  // Close popup when clicking outside the editor container
  useEffect(() => {
    if (!isLinkPopoverOpen) return;
    const clickHandler = (e: MouseEvent) => {
      const containerEl = document.getElementById("simple-editor-container");
      if (containerEl && !containerEl.contains(e.target as Node)) {
        setIsLinkPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  }, [isLinkPopoverOpen]);

  // Set initial content once the editor is ready (for edit mode pre-filling)
  useEffect(() => {
    if (editor && initialValue && initialValue.trim() !== '' && editor.isEmpty) {
      editor.commands.setContent(initialValue);
    }
  }, [editor, initialValue]);

  if (!editor) return null;

  const handleLinkClick = () => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsLinkPopoverOpen((prev) => !prev);
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      const { empty } = editor.state.selection;
      if (empty) {
        editor.chain().focus().insertContent(`<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${formattedUrl}</a>`).run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl }).run();
      }
    }
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  const btn = "p-1.5 rounded hover:bg-red-700";

  return (
    <div id="simple-editor-container" className="border border-gray-300 hover:border-red-900 rounded-xl overflow-visible relative bg-white">
      {/* Custom Bubble Link Menu */}
      {bubblePos && (
        <div 
          style={{ 
            top: `${bubblePos.top}px`, 
            left: `${bubblePos.left}px` 
          }}
          className="absolute z-50 bg-[#f8f9fa] border border-[#ccc] rounded shadow-lg p-2.5 w-72 animate-in fade-in zoom-in-95 duration-100 font-sans"
        >
          {/* Arrow */}
          <div 
            className={`absolute w-2.5 h-2.5 bg-[#f8f9fa] border-l border-t border-[#ccc] transform rotate-45 left-5 ${
              bubblePos.isFlipped 
                ? 'bottom-[-6px] border-l-0 border-t-0 border-r border-b' 
                : 'top-[-6px]'
            }`} 
            style={{ width: '10px', height: '10px' }} 
          />

          <div className="text-[11px] font-semibold text-gray-700 mb-1 px-0.5">Paste URL or type to search</div>
          
          <div className="flex gap-1.5 items-center">
            <input
              type="text"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 border border-[#a4c2f4] focus:border-[#4285f4] rounded bg-white px-2 py-1 text-xs outline-none text-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyLink();
                } else if (e.key === 'Escape') {
                  setIsLinkPopoverOpen(false);
                }
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={applyLink}
              className="bg-[#3b71ca] hover:bg-[#28509e] text-white p-1 rounded transition-all flex items-center justify-center h-[26px] w-[26px] shrink-0"
              title="Apply Link"
            >
              {/* Return Key Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20"></polyline>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
              </svg>
            </button>
            {editor.isActive("link") && (
              <button
                type="button"
                onClick={removeLink}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded transition-all flex items-center justify-center h-[26px] w-[26px] shrink-0"
                title="Remove Link"
              >
                {/* Unlink Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 0 1 0 12.72"></path>
                  <line x1="2" y1="12" x2="12" y2="12"></line>
                  <polyline points="12 2 12 22"></polyline>
                  <path d="M5.64 17.36a9 9 0 0 1 0-12.72"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-wrap rounded-t-xl">
        {/* Headings */}
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Text */}
        <button type="button" className={btn} onClick={() => editor.chain().focus().setParagraph().run()}>
          T
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FaBold size={14} />
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FaItalic size={14} />
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FaUnderline size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Lists */}
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FaListUl size={14} />
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FaListOl size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Align */}
        <button type="button" className={btn} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <FaAlignLeft size={14} />
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <FaAlignCenter size={14} />
        </button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <FaAlignRight size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Link */}
        <button 
          type="button" 
          className={`${btn} ${editor.isActive("link") ? "bg-red-800 text-white" : ""}`}
          onClick={handleLinkClick}
          onMouseDown={(e) => e.preventDefault()}
        >
          <FaLink size={14} />
        </button>
      </div>

      {/* Editor */}
      <div 
        onClick={() => editor.chain().focus().run()}
        className="cursor-text min-h-[150px] rounded-b-xl"
      >
        <EditorContent
          editor={editor}
          className="p-4 text-sm prose max-w-none focus:outline-none"
        />
      </div>
      
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap {
          outline: none !important;
          min-height: 150px;
        }
        .ProseMirror {
          min-height: 150px;
          outline: none !important;
        }
      `}</style>
    </div>
  );
}