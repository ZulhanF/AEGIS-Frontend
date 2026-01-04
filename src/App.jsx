import React, { lazy, Suspense } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import SideBar from "@/components/sidebar/SideBar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTickets } from "@/hooks/useTickets";
import { useMachine } from "@/hooks/useMachine";
import { useStatus } from "./hooks/useStatus";
import { useUsers } from "./hooks/useUsers";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Toaster } from "@/components/ui/sonner";
import { AdminGuard } from "@/components/guards/AdminGuard";

// Import login/register directly (not lazy) for faster first load
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Lazy load other pages
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const TicketPage = lazy(() => import("./pages/TicketPage"));
const CreateTicketPage = lazy(() => import("./pages/CreateTicketPage"));
const OverviewPage = lazy(() => import("./pages/OverviewPage"));
const UserManagementPage = lazy(() => import("./pages/UserManagementPage"));
const AddMachinePage = lazy(() => import("./pages/AddMachinePage"));
const ViewMachinePage = lazy(() => import("./pages/ViewMachinePage"));
const AddMachineStatus = lazy(() => import("./pages/AddMachineStatusPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading component for suspense fallback - minimal for better LCP
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  // Custom hooks untuk auth dan tickets
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Defer non-critical hooks to reduce TBT
  const [deferredLoad, setDeferredLoad] = React.useState(false);
  const tickets = useTickets();
  const machines = useMachine();
  const status = useStatus();
  const users = useUsers();
  
  // Defer keyboard shortcuts to idle time
  React.useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setDeferredLoad(true));
    } else {
      setTimeout(() => setDeferredLoad(true), 100);
    }
  }, []);
  
  // Enable global keyboard shortcuts after initial render
  useKeyboardShortcuts();

  
  React.useEffect(() => {
    const initApp = async () => {
      await auth.checkSession();
    };

    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect ke overview setelah login dan protect admin routes
  React.useEffect(() => {
    if (auth.user) {
      // Redirect ke overview jika di halaman login atau root
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/overview", { replace: true });
      }
    } else if (!auth.isLoading && !auth.user) {
      // Jika user logout, redirect ke login page
      if (location.pathname !== "/" && location.pathname !== "/register") {
        navigate("/", { replace: true });
      }
    }
  }, [auth.user, auth.isLoading, location.pathname, navigate]);

  // Fetch tickets setelah user login - defer to reduce initial load time
  React.useEffect(() => {
    if (auth.user) {
      // Use requestIdleCallback to defer non-critical work
      const idleCallback = 'requestIdleCallback' in window 
        ? window.requestIdleCallback 
        : (cb) => setTimeout(cb, 1);
      
      idleCallback(() => {
        tickets.fetchTickets();
        machines.fetchMachines();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  if (auth.isLoading) {
    return <PageLoader />;
  }

  // Page login dan regis jika belum login (no Suspense needed - already imported)
  if (!auth.user) {
    return (
      <>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage login={auth.login} isLoading={auth.isLoading} />
            }
          />
          <Route
            path="/register"
            element={<RegisterPage register={auth.register} />}
          />
          <Route
            path="*"
            element={
              <LoginPage login={auth.login} isLoading={auth.isLoading} />
            }
          />
        </Routes>
      </>
    );
  }

  // Main app di sini
  return (
    <UserProvider>
      <ThemeProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-screen w-full bg-background">
            <SideBar onLogout={auth.logout} user={auth.user} />
            <SidebarInset className="flex-1">
              <Header />
              <main className="">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route
                      path="/tickets"
                      element={
                        <TicketPage
                          tickets={tickets.tickets}
                          loading={tickets.loading}
                          onDeleteTicket={tickets.useDeleteTicket}
                          machines={machines.machines}
                          onEditTicket={tickets.useEditTicket}
                        />
                      }
                    />
                    <Route
                      path="/machines/add"
                      element={
                        <AddMachinePage
                          onAddMachine={machines.useAddMachine}
                          onMachineAdded={() => machines.fetchMachines()}
                        />
                      }
                    />
                    <Route
                      path="/machines"
                      element={
                        <ViewMachinePage
                          machines={machines.machines}
                          onDeleteMachine={machines.useDeleteMachine}
                          onEditMachine={machines.useEditMachine}
                          onFetchMachineStatus={status.fetchStatusByMachineId}
                        />
                      }
                    />
                    <Route
                      path="/machines/add-status"
                      element={
                        <AddMachineStatus
                          onCreateStatus={status.useCreateStatus}
                          machines={machines.machines}
                          onStatusAdded={() => status.fetchStatuses()}
                        />
                      }
                    />
                    <Route
                      path="/tickets/create"
                      element={
                        <CreateTicketPage
                          machines={machines.machines}
                          onCreateTicket={tickets.useCreateTicket}
                          onTicketCreated={() => tickets.fetchTickets()}
                        />
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ChatPage user={auth.user} />
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <AdminGuard user={auth.user}>
                          <UserManagementPage useUsers={users} />
                        </AdminGuard>
                      }
                    />
                    <Route path="/overview" element={<OverviewPage />} />
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
            </SidebarInset>
          </div>
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
