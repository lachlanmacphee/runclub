import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

// Components
import { buttonVariants } from "../ui/button";

export function MobileLink({
  path,
  label,
  notification,
  setter,
}: {
  path: string;
  label: string;
  notification: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
}) {
  if (notification)
    return (
      <div className="flex items-center justify-center shadow-md rounded-lg h-16">
        <Link
          to={path}
          onClick={() => setter(false)}
          className={
            buttonVariants({ variant: "secondary" }) +
            " w-full h-full [&_span]:w-full"
          }
        >
          <span className="text-red-500 text-center animate-pulse duration-700">
            {label}
          </span>
        </Link>
      </div>
    );

  return (
    <div className="flex items-center justify-center shadow-md rounded-lg h-16">
      <Link
        aria-label={label}
        to={path}
        className={
          buttonVariants({ variant: "secondary" }) +
          " w-full h-full [&_span]:w-full"
        }
        onClick={() => setter(false)}
      >
        {label}
      </Link>
    </div>
  );
}
