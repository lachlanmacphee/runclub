import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { SignUp } from "./pages/signUp";

import { RequireAuth } from "./components/requireAuth";
import { Dashboard } from "./pages/dashboard";
import { NewRun } from "./pages/newRun";
import { PastRuns } from "./pages/pastRuns";

import { PocketProvider } from "./contexts/PocketContext";
import { ThemeProvider } from "./contexts/ThemeProviderContext";

export default function App() {
  return (
    <PocketProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pastruns" element={<PastRuns />} />
              <Route path="/newrun" element={<NewRun />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PocketProvider>
  );
}
