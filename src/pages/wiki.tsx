import Tiptap from "@/components/editor/tipTapEditor";
import { Sidebar } from "@/components/sidebar";
import { usePocket } from "@/contexts";
import { RecordModel } from "pocketbase";
import { useCallback, useEffect, useState } from "react";

export const Wiki = () => {
  const { pb } = usePocket();
  const [activePage, setActivePage] = useState<RecordModel>();
  const [wikiData, setWikiData] = useState<Record<string, RecordModel[]>>();

  const handleSave = useCallback(
    async (content: string) => {
      if (activePage) {
        const updatedPage = await pb
          .collection("wiki_pages")
          .update(activePage.id, { content });
        const newWikiData = { ...wikiData };
        const oldPageIdx = newWikiData[activePage.category].findIndex(
          (page) => page.id == activePage.id
        );
        newWikiData[activePage.category][oldPageIdx] = updatedPage;
        setWikiData(newWikiData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activePage, pb]
  );

  useEffect(() => {
    async function fetchWikiData() {
      const pages = await pb.collection("wiki_pages").getFullList();
      const newWikiData: Record<string, RecordModel[]> = {};
      pages.map((page) => {
        if (newWikiData[page.category]) {
          newWikiData[page.category].push(page);
          return;
        }
        newWikiData[page.category] = [page];
      });
      setWikiData(newWikiData);
      setActivePage(newWikiData["App"][0]);
    }
    fetchWikiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-[minmax(200px,0.25fr)_1fr]">
      <Sidebar
        wikiData={wikiData}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <Tiptap handleSave={handleSave} content={activePage?.content} />
    </div>
  );
};
