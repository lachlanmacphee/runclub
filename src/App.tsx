import { Route, Switch } from "wouter";
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
import { Donations } from "@/pages/donations";
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
import { TriviaPage } from "@/pages/trivia";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PocketProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/resetpassword" component={ResetPassword} />
            <Route>
              <Layout>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/runs" component={Runs} />
                  <Route path="/runs/:runId/edit" component={EditRun} />
                  <Route path="/faqs" component={FAQs} />
                  <Route path="/donations" component={Donations} />
                  <Route path="/contact" component={ContactUs} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/events" component={Events} />
                  <Route path="/waiver" component={Waiver} />
                  <Route>
                    <RequireAuth>
                      <Switch>
                        <Route path="/newrun" component={NewRun} />
                        <Route path="/volunteer" component={Volunteer} />
                        <Route path="/manage" component={ManageClub} />
                        <Route path="/wiki" component={Wiki} />
                        <Route path="/account" component={Account} />
                        <Route path="/stats/member" component={MemberStats} />
                        <Route
                          path="/stats/member/:waiverId"
                          component={MemberStats}
                        />
                        <Route path="/stats/club" component={ClubStats} />
                        <Route path="/trivia" component={TriviaPage} />
                      </Switch>
                    </RequireAuth>
                  </Route>
                </Switch>
              </Layout>
            </Route>
          </Switch>
          <Toaster />
        </ThemeProvider>
      </PocketProvider>
    </QueryClientProvider>
  );
}
