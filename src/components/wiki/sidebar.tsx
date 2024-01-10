// Types
import { RecordModel } from "pocketbase";

// Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar({
  wikiData,
  activePage,
  setActivePage,
}: {
  wikiData: Record<string, RecordModel[]> | undefined;
  activePage: RecordModel | undefined;
  setActivePage: (page: RecordModel) => void;
}) {
  if (!wikiData) {
    return (
      <ScrollArea className="h-[calc(100vh-72px)]">
        <div className="pb-12">
          <div className="space-y-4 py-4">Loading...</div>
        </div>
      </ScrollArea>
    );
  }

  const categories = Object.keys(wikiData);

  return (
    <ScrollArea className="h-[calc(100vh-72px)]">
      <div className="pb-12">
        <div className="space-y-4 py-4">
          {categories.map((category) => (
            <div key={category} className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {category}
              </h2>
              <div className="space-y-1">
                {wikiData[category].map((page) => (
                  <Button
                    key={page.name}
                    variant={
                      activePage?.name === page.name ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setActivePage(page)}
                  >
                    {page.name}
                  </Button>
                ))}
                <Button variant="ghost" className="w-full justify-start">
                  Add Page
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
