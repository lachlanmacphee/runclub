import { useContext } from "react";
import { PocketContext } from "./PocketContext";
import { ThemeProviderContext } from "./ThemeProviderContext";

export const usePocket = () => {
  const pocketContext = useContext(PocketContext);

  if (!pocketContext) {
    throw new Error(
      "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    );
  }

  return pocketContext;
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
