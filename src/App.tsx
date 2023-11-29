import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PocketProvider } from "./contexts/PocketContext";
import { ThemeProvider } from "./contexts/ThemeProviderContext";

import { Login } from "./pages/login";
import { SignUp } from "./pages/signUp";
import { Home } from "./pages/home";
import { NewRun } from "./pages/newRun";
import { Runs } from "./pages/runs";
import { FAQs } from "./pages/faqs";
import { ContactUs } from "./pages/contactUs";
import { Privacy } from "./pages/privacy";

import { Layout } from "./components/layout";
import { RequireAuth } from "./components/requireAuth";
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
              <Route element={<RequireAuth />}>
                <Route path="/newrun" element={<NewRun />} />
              </Route>
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </PocketProvider>
  );
}
