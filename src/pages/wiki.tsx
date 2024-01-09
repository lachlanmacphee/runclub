import Tiptap from "@/components/editor/tipTapEditor";
import { Sidebar } from "@/components/sidebar";

export const Wiki = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Tiptap />;
    </div>
  );
};
