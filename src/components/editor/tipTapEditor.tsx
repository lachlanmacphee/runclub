import { Dispatch, SetStateAction, useEffect } from "react";

// Libraries
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

// Components
import { MenuBar } from "./menuBar";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Start writing your wiki page here...",
  }),
];

const editorProps = {
  attributes: {
    class: "prose dark:prose-invert prose-2xl max-w-none focus:outline-none",
  },
};

const Tiptap = ({
  content,
  isContentChanged,
  setIsContentChanged,
  handleSave,
}: {
  content: string;
  isContentChanged: boolean;
  setIsContentChanged: Dispatch<SetStateAction<boolean>>;
  handleSave: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions,
    content,
    editorProps,
    onUpdate: () => {
      setIsContentChanged(true);
    },
  });

  useEffect(() => {
    editor?.commands.setContent(content);
  }, [editor, content]);

  return (
    <div className="flex flex-col p-4 gap-4">
      <MenuBar
        editor={editor}
        isContentChanged={isContentChanged}
        handleSave={handleSave}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
