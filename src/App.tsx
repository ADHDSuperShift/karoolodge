
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Admin from "./pages/Admin";
import SimpleAdmin from "./pages/SimpleAdmin";
import AdminPage from "./pages/AdminPage";
import NewAdminPage from "./pages/NewAdminPage";
import ComprehensiveAdmin from "./components/ComprehensiveAdmin";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system">
    <AuthProvider>
      <GlobalStateProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/admin" element={<ComprehensiveAdmin />} />
                <Route path="/old-admin" element={<Admin />} />
                <Route path="/old-admin2" element={<AdminPage />} />
                <Route path="/drag-admin" element={<NewAdminPage />} />
                <Route path="/simple-admin" element={<SimpleAdmin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </GlobalStateProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
