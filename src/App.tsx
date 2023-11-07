import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { SignUp } from "./pages/signUp";

import { RequireAuth } from "./components/requireAuth";
import { LatestRun } from "./pages/latestRun";
import { NewRun } from "./pages/newRun";
import { PastRuns } from "./pages/pastRuns";

import { PocketProvider } from "./contexts/PocketContext";
import { ThemeProvider } from "./contexts/ThemeProviderContext";
import { Home } from "./pages/home";
import { Layout } from "./components/layout";
import { FAQs } from "./pages/faqs";

export default function App() {
  return (
    <PocketProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route element={<RequireAuth />}>
                <Route path="/latestrun" element={<LatestRun />} />
                <Route path="/pastruns" element={<PastRuns />} />
                <Route path="/newrun" element={<NewRun />} />
              </Route>
              <Route path="faqs" element={<FAQs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PocketProvider>
  );
}
