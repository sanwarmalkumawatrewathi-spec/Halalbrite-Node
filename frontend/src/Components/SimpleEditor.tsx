"use client";

import { useEditor, EditorContent } from "@tiptap/react";
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
}: {
  onChange: (value: string) => void;
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

  if (!editor) return null;

  const setLink = () => {
    const url = prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const btn = "p-1.5 rounded hover:bg-red-700";

  return (
    <div className="border border-gray-300 hover:border-red-900 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-wrap">
        {/* Headings */}
        <button className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Text */}
        <button className={btn} onClick={() => editor.chain().focus().setParagraph().run()}>
          T
        </button>
        <button className={btn} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FaBold size={14} />
        </button>
        <button className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FaItalic size={14} />
        </button>
        <button className={btn} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FaUnderline size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Lists */}
        <button className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FaListUl size={14} />
        </button>
        <button className={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FaListOl size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Align */}
        <button className={btn} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <FaAlignLeft size={14} />
        </button>
        <button className={btn} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <FaAlignCenter size={14} />
        </button>
        <button className={btn} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <FaAlignRight size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Link */}
        <button className={btn} onClick={setLink}>
          <FaLink size={14} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[150px] text-sm outline-none"
      />
    </div>
  );
}