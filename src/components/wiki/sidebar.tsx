// Types
import { RecordModel } from "pocketbase";

// Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddPageDialog } from "./addPageDialog";
import { SwitchPageDialog } from "./switchPageDialog";

export function Sidebar({
  wikiData,
  activePage,
  setActivePage,
  refreshPages,
}: {
  wikiData: Record<string, RecordModel[]> | undefined;
  activePage: RecordModel | undefined;
  setActivePage: (page: RecordModel) => void;
  refreshPages: VoidFunction;
}) {
  if (!wikiData) {
    return <span>Loading wiki pages...</span>;
  }

  const categories = Object.keys(wikiData);

  return (
    <>
      <div className="flex flex-col space-y-4 md:hidden">
        <AddPageDialog refreshPages={refreshPages} />
        <SwitchPageDialog
          categories={categories}
          wikiData={wikiData}
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </div>
      <ScrollArea className="hidden md:block h-[calc(100vh-72px)]">
        <div className="space-y-4 py-4 md:pr-8">
          <AddPageDialog refreshPages={refreshPages} />
          {categories.map((category) => (
            <div key={category}>
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {category}
              </h2>
              <div className="space-y-1">
                {wikiData[category].map((page) => (
                  <Button
                    key={page.id}
                    variant={activePage?.id === page.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActivePage(page)}
                  >
                    {page.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
