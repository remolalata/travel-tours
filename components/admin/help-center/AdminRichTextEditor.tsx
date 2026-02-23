'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

type AdminRichTextEditorToolbarLabels = {
  paragraph: string;
  bold: string;
  italic: string;
  bulletList: string;
  orderedList: string;
};

type AdminRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  toolbarLabels: AdminRichTextEditorToolbarLabels;
  ariaLabel: string;
};

const defaultToolbarBorderColor = 'rgba(5, 7, 60, 0.14)';

const toolbarButtonStyle = {
  border: `1px solid ${defaultToolbarBorderColor}`,
  borderRadius: 10,
  padding: '6px 10px',
  background: '#fff',
  color: '#05073c',
  fontSize: 13,
  lineHeight: 1.2,
  cursor: 'pointer',
} as const;

export default function AdminRichTextEditor({
  value,
  onChange,
  toolbarLabels,
  ariaLabel,
}: AdminRichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'admin-rich-text-editor__content',
        'aria-label': ariaLabel,
        style:
          'min-height: 140px; outline: none; color: #05073c; font-size: 14px; line-height: 1.6;',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    if (currentHtml !== value) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        border: '1px solid rgba(5, 7, 60, 0.14)',
        borderRadius: 14,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          padding: '10px 12px',
          borderBottom: '1px solid rgba(5, 7, 60, 0.08)',
          background: 'rgba(5, 7, 60, 0.02)',
        }}
      >
        <button
          type='button'
          style={{
            ...toolbarButtonStyle,
            borderColor: editor.isActive('paragraph') ? 'rgba(235, 102, 43, 0.45)' : defaultToolbarBorderColor,
          }}
          onClick={() => editor.chain().focus().setParagraph().run()}
          aria-label={toolbarLabels.paragraph}
          title={toolbarLabels.paragraph}
        >
          {toolbarLabels.paragraph}
        </button>
        <button
          type='button'
          style={{
            ...toolbarButtonStyle,
            fontWeight: 700,
            borderColor: editor.isActive('bold') ? 'rgba(235, 102, 43, 0.45)' : defaultToolbarBorderColor,
          }}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label={toolbarLabels.bold}
          title={toolbarLabels.bold}
        >
          B
        </button>
        <button
          type='button'
          style={{
            ...toolbarButtonStyle,
            fontStyle: 'italic',
            borderColor: editor.isActive('italic') ? 'rgba(235, 102, 43, 0.45)' : defaultToolbarBorderColor,
          }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label={toolbarLabels.italic}
          title={toolbarLabels.italic}
        >
          I
        </button>
        <button
          type='button'
          style={{
            ...toolbarButtonStyle,
            borderColor: editor.isActive('bulletList') ? 'rgba(235, 102, 43, 0.45)' : defaultToolbarBorderColor,
          }}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label={toolbarLabels.bulletList}
          title={toolbarLabels.bulletList}
        >
          •
        </button>
        <button
          type='button'
          style={{
            ...toolbarButtonStyle,
            borderColor: editor.isActive('orderedList') ? 'rgba(235, 102, 43, 0.45)' : defaultToolbarBorderColor,
          }}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label={toolbarLabels.orderedList}
          title={toolbarLabels.orderedList}
        >
          1.
        </button>
      </div>

      <div style={{ padding: 12 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
