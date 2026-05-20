import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
}

function ToolbarButton({
    onClick,
    active,
    children,
    title,
}: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
    title?: string
}) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => {
                e.preventDefault()
                onClick()
            }}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                active
                    ? 'bg-neutral-600 text-neutral-50'
                    : 'text-neutral-400 hover:text-neutral-50 hover:bg-neutral-700'
            }`}
        >
            {children}
        </button>
    )
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate({ editor }) {
            const html = editor.getHTML()
            onChange(html === '<p></p>' ? '' : html)
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor min-h-[180px] px-3 py-2.5 text-sm text-neutral-50 focus:outline-none',
            },
        },
    })

    useEffect(() => {
        if (!editor || editor.isDestroyed) return
        const normalize = (html: string) => (html === '<p></p>' ? '' : html)
        if (normalize(editor.getHTML()) !== normalize(value)) {
            editor.commands.setContent(value || '')
        }
    }, [editor, value])

    return (
        <div className="border border-neutral-700 rounded-lg bg-neutral-800 overflow-hidden focus-within:ring-1 focus-within:ring-neutral-500 transition-colors">
            <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-neutral-700 bg-neutral-900">
                <ToolbarButton
                    title="Pogrubienie"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    active={editor?.isActive('bold')}
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    title="Kursywa"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    active={editor?.isActive('italic')}
                >
                    <em>I</em>
                </ToolbarButton>
                <div className="w-px h-4 bg-neutral-700 mx-1" />
                <ToolbarButton
                    title="Nagłówek H2"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor?.isActive('heading', { level: 2 })}
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    title="Nagłówek H3"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor?.isActive('heading', { level: 3 })}
                >
                    H3
                </ToolbarButton>
                <div className="w-px h-4 bg-neutral-700 mx-1" />
                <ToolbarButton
                    title="Lista punktowana"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    active={editor?.isActive('bulletList')}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    title="Lista numerowana"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    active={editor?.isActive('orderedList')}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
                    </svg>
                </ToolbarButton>
                <div className="w-px h-4 bg-neutral-700 mx-1" />
                <ToolbarButton
                    title="Cytat"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    active={editor?.isActive('blockquote')}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}