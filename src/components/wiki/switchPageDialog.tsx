import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { RecordModel } from "pocketbase";
import { ScrollArea } from "../ui/scroll-area";

export function SwitchPageDialog({
  categories,
  wikiData,
  activePage,
  setActivePage,
}: {
  categories: string[];
  wikiData: Record<string, RecordModel[]> | undefined;
  activePage: RecordModel | undefined;
  setActivePage: (page: RecordModel) => void;
}) {
  if (!wikiData) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sticky z-10 top-0">
          Switch Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Wiki Page</DialogTitle>
          <DialogDescription>
            Click the page you wish to switch to.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          {categories.map((category) => (
            <div key={category} className="mb-4">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {category}
              </h2>
              <div className="space-y-1">
                {wikiData[category].map((page) => (
                  <DialogClose key={page.id} asChild>
                    <Button
                      variant={activePage?.id === page.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActivePage(page)}
                    >
                      {page.name}
                    </Button>
                  </DialogClose>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
