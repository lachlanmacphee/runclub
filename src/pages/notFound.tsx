import { buttonVariants } from "@/components/ui/button";
import { Link } from "wouter";

export function NotFound() {
  return (
    <div className="flex items-center gap-4 flex-col">
      <h1 className="text-5xl font-bold">Oh oh! Something went wrong!</h1>
      <h2 className="text-xl">We were unable to find this page</h2>
      <Link href="/runs" className={buttonVariants({ variant: "default" })}>
        Did you mean to look at the Runs page?
      </Link>
    </div>
  );
}
