import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Volunteering
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              Page 1
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 2
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 3
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            App
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Page 1
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 2
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 3
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 4
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 5
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Finances
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Page 1
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 2
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 3
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 4
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Page 5
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
