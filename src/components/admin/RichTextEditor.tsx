'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter text here...',
  className = '',
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable all except what we need
        bold: false,
        italic: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
      Bold,
      Italic,
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
        placeholder: placeholder,
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`} id={id}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors italic ${
            editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors underline ${
            editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
          }`}
          title="Underline (Ctrl+U)"
        >
          U
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Global styles for the editor */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          outline: none;
          color: #1f2937;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .ProseMirror p {
          margin: 0.5rem 0;
          color: #1f2937;
        }
        
        .ProseMirror p:first-child {
          margin-top: 0;
        }
        
        .ProseMirror p:last-child {
          margin-bottom: 0;
        }
        
        .ProseMirror strong {
          font-weight: 700;
          color: #1f2937;
        }
        
        .ProseMirror em {
          font-style: italic;
          color: #1f2937;
        }
        
        .ProseMirror u {
          text-decoration: underline;
          color: #1f2937;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
