import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PocketProvider } from "./contexts/PocketContext";
import { ThemeProvider } from "./contexts/ThemeProviderContext";

import { Login } from "./pages/login";
import { SignUp } from "./pages/signUp";
import { Home } from "./pages/home";
import { NewRun } from "./pages/newRun";
import { Volunteer } from "./pages/volunteer";
import { Runs } from "./pages/runs";
import { Leaderboard } from "./pages/leaderboard";
import { ManageClub } from "./pages/manageClub";
import { FAQs } from "./pages/faqs";
import { Wiki } from "./pages/wiki";
import { ContactUs } from "./pages/contactUs";
import { Privacy } from "./pages/privacy";
import { NotFound } from "./pages/notFound";

import { Layout } from "./components/core/layout";
import { RequireAuth } from "./components/core/requireAuth";
import { Toaster } from "@/components/ui/toaster";

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
              <Route path="/runs" element={<Runs />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route element={<RequireAuth />}>
                <Route path="/newrun" element={<NewRun />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/manage" element={<ManageClub />} />
                <Route path="/wiki" element={<Wiki />} />
              </Route>
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </PocketProvider>
  );
}
