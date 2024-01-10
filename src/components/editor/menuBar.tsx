// Libraries
import { Editor } from "@tiptap/react";

// Components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

// Icons
import {
  Ban,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  ListIcon,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

export const MenuBar = ({
  editor,
  handleSave,
  isContentChanged,
}: {
  editor: Editor | null;
  handleSave: (content: string) => void;
  isContentChanged: boolean;
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex">
      <ToggleGroup type="multiple" className="justify-start">
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikethrough"
          aria-label="Toggle strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="code"
          aria-label="Toggle code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        variant="ghost"
        value="clear"
        aria-label="Clear formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        <Ban className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="paragraph"
        aria-label="Toggle paragraph"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="headingOne"
        aria-label="Toggle heading one"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="headingTwo"
        aria-label="Toggle heading two"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="headingThree"
        aria-label="Toggle heading three"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="headingFour"
        aria-label="Toggle heading four"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="headingFive"
        aria-label="Toggle heading five"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <Heading5 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="headingSix"
        aria-label="Toggle heading six"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        <Heading6 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="unorderedList"
        aria-label="Toggle unordered list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="orderedList"
        aria-label="Toggle ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="quote"
        aria-label="Toggle quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="undo"
        aria-label="Undo last change"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        value="redo"
        aria-label="Redo last change"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        className="ml-auto"
        disabled={!isContentChanged}
        onClick={() => {
          if (editor) {
            handleSave(editor?.getHTML());
          }
        }}
      >
        Save
      </Button>
    </div>
  );
};
