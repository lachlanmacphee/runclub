import { useContext } from "react";
import { PocketContext } from "./PocketContext";

export const usePocket = () => {
  const pocketContext = useContext(PocketContext);

  if (!pocketContext) {
    throw new Error(
      "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    );
  }

  return pocketContext;
};
