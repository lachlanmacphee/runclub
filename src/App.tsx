import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PocketProvider } from "./contexts/PocketContext";
import { ThemeProvider } from "./contexts/ThemeProviderContext";

import { Login } from "@/pages/login";
import { SignUp } from "@/pages/signUp";
import { Home } from "@/pages/home";
import { NewRun } from "@/pages/newRun";
import { Volunteer } from "@/pages/volunteer";
import { Runs } from "@/pages/runs";
import { ClubStats } from "@/pages/clubStats";
import { ManageClub } from "@/pages/manageClub";
import { FAQs } from "@/pages/faqs";
import { Wiki } from "@/pages/wiki";
import { ContactUs } from "@/pages/contactUs";
import { Privacy } from "@/pages/privacy";

import { Layout } from "@/components/core/layout";
import { RequireAuth } from "@/components/core/requireAuth";
import { Toaster } from "@/components/ui/toaster";
import { Events } from "@/pages/events";
import { ResetPassword } from "@/pages/resetPassword";
import { Waiver } from "@/pages/waiver";
import { Account } from "@/pages/user";
import { MemberStats } from "@/pages/memberStats";
import { EditRun } from "@/pages/editRun";

export default function App() {
  return (
    <PocketProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/runs" element={<Runs />} />
              <Route path="/runs/:runId/edit" element={<EditRun />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/events" element={<Events />} />
              <Route path="/waiver" element={<Waiver />} />
              <Route element={<RequireAuth />}>
                <Route path="/newrun" element={<NewRun />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/manage" element={<ManageClub />} />
                <Route path="/wiki" element={<Wiki />} />
                <Route path="/account" element={<Account />} />
                <Route path="/stats">
                  <Route path="member" element={<MemberStats />} />
                  <Route path="member/:waiverId" element={<MemberStats />} />
                  <Route path="club" element={<ClubStats />} />
                </Route>
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </PocketProvider>
  );
}
