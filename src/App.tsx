import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import { PocketProvider } from "./contexts/PocketContext";
import { ThemeProvider } from "./contexts/ThemeProviderContext";

const Login = lazy(() =>
  import("@/pages/login").then((m) => ({ default: m.Login })),
);
const SignUp = lazy(() =>
  import("@/pages/signUp").then((m) => ({ default: m.SignUp })),
);
import { Home } from "@/pages/home";
const NewRun = lazy(() =>
  import("@/pages/newRun").then((m) => ({ default: m.NewRun })),
);
const Volunteer = lazy(() =>
  import("@/pages/volunteer").then((m) => ({ default: m.Volunteer })),
);
const Runs = lazy(() =>
  import("@/pages/runs").then((m) => ({ default: m.Runs })),
);
const ClubStats = lazy(() =>
  import("@/pages/clubStats").then((m) => ({ default: m.ClubStats })),
);
const ManageClub = lazy(() =>
  import("@/pages/manageClub").then((m) => ({ default: m.ManageClub })),
);
const FAQs = lazy(() =>
  import("@/pages/faqs").then((m) => ({ default: m.FAQs })),
);
const Donations = lazy(() =>
  import("@/pages/donations").then((m) => ({ default: m.Donations })),
);
const Wiki = lazy(() =>
  import("@/pages/wiki").then((m) => ({ default: m.Wiki })),
);
const ContactUs = lazy(() =>
  import("@/pages/contactUs").then((m) => ({ default: m.ContactUs })),
);
const Privacy = lazy(() =>
  import("@/pages/privacy").then((m) => ({ default: m.Privacy })),
);

import { Layout } from "@/components/core/layout";
import { RequireAuth } from "@/components/core/requireAuth";
import { Toaster } from "@/components/ui/toaster";
const Events = lazy(() =>
  import("@/pages/events").then((m) => ({ default: m.Events })),
);
const ResetPassword = lazy(() =>
  import("@/pages/resetPassword").then((m) => ({ default: m.ResetPassword })),
);
const Waiver = lazy(() =>
  import("@/pages/waiver").then((m) => ({ default: m.Waiver })),
);
const Account = lazy(() =>
  import("@/pages/user").then((m) => ({ default: m.Account })),
);
const MemberStats = lazy(() =>
  import("@/pages/memberStats").then((m) => ({ default: m.MemberStats })),
);
const EditRun = lazy(() =>
  import("@/pages/editRun").then((m) => ({ default: m.EditRun })),
);
const TriviaPage = lazy(() =>
  import("@/pages/trivia").then((m) => ({ default: m.TriviaPage })),
);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PocketProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Suspense fallback={null}>
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
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </PocketProvider>
    </QueryClientProvider>
  );
}
