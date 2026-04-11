import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import StudentDashboard from "@/pages/StudentDashboard";
import OrganizerDashboard from "@/pages/OrganizerDashboard";
import ClubsPage from "@/pages/ClubsPage";
import AdminPortal from "@/pages/AdminPortal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AnimatedRouter() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ minHeight: "100vh" }}
      >
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/events/:id" component={EventDetailPage} />
          <Route path="/student" component={StudentDashboard} />
          <Route path="/organizer" component={OrganizerDashboard} />
          <Route path="/clubs" component={ClubsPage} />
          <Route path="/admin" component={AdminPortal} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AnimatedRouter />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
