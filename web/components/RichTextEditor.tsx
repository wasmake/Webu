"use client";

import { useMemo } from "react";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface RichTextEditorProps {
  value?: string;
  onUpdate?: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onUpdate, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escribe notas contextuales..." }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 focus-visible:outline-none",
      },
    },
    onUpdate({ editor }) {
      onUpdate?.(editor.getHTML());
    },
  });

  const actions = useMemo(
    () => [
      {
        icon: <Bold className="h-4 w-4" />,
        handler: () => editor?.chain().focus().toggleBold().run(),
        isActive: editor?.isActive("bold"),
        label: "Negritas",
      },
      {
        icon: <Italic className="h-4 w-4" />,
        handler: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editor?.isActive("italic"),
        label: "Italica",
      },
      {
        icon: <List className="h-4 w-4" />,
        handler: () => editor?.chain().focus().toggleBulletList().run(),
        isActive: editor?.isActive("bulletList"),
        label: "Lista",
      },
      {
        icon: <ListOrdered className="h-4 w-4" />,
        handler: () => editor?.chain().focus().toggleOrderedList().run(),
        isActive: editor?.isActive("orderedList"),
        label: "Lista ordenada",
      },
      {
        icon: <Link2 className="h-4 w-4" />,
        handler: () => {
          const url = window.prompt("URL destino");
          if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
          }
        },
        isActive: editor?.isActive("link"),
        label: "Hipervinculo",
      },
    ],
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="relative space-y-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            size="sm"
            variant={action.isActive ? "default" : "ghost"}
            onClick={action.handler}
            type="button"
            className={cn("h-8 w-8 p-0", action.isActive && "bg-indigo-500 text-white")}
          >
            <span className="sr-only">{action.label}</span>
            {action.icon}
          </Button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor} className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
        Usa este texto para anclar contexto a archivos o timecodes.
      </BubbleMenu>
    </div>
  );
}
