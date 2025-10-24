import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import BackToTop from "@/components/BackToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JewelleryCategory from "./pages/JewelleryCategory";
import JewelleryCategories from "./pages/Categories";
import GemCategory from "./pages/GemCategory";
import GemDetail from "./pages/GemDetail";
import ProductDetail from "./pages/ProductDetail";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BranchManagement from "./pages/admin/BranchManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import MetalManagement from "./pages/admin/MetalManagement";
import ServiceRequests from "./pages/admin/ServiceRequests";
import UserManagement from "./pages/admin/UserManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";
import GemManagement from "./pages/admin/GemManagement";
import BridalCollection from "./pages/BridalCollection";
import BridalCategoryCollection from "./pages/BridalCategoryCollection";
import CustomDesign from "./pages/CustomDesign";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StoreLocator from "./pages/StoreLocator";
import SearchResults from "./pages/SearchResults";
import JewelleryRepairs from "./pages/JewelleryRepairs";
import CareGuide from "./pages/CareGuide";
import WarrantyInfo from "./pages/WarrantyInfo";
import SizingGuide from "./pages/SizingGuide";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/jewellery" element={<JewelleryCategories />} />
            <Route path="/jewellery/:category" element={<JewelleryCategory />} />
            <Route path="/gems" element={<GemCategory />} />

            <Route path="/gem/:id" element={<GemDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/bridal" element={<BridalCollection />} />
            <Route path="/bridal/collection/:category" element={<BridalCategoryCollection />} />
            <Route path="/jewellery/bridal" element={<BridalCollection />} />
            <Route path="/custom-design" element={<CustomDesign />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/stores" element={<StoreLocator />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/care-guide" element={<CareGuide />} />
            <Route path="/warranty-info" element={<WarrantyInfo />} />
            <Route path="/sizing-guide" element={<SizingGuide />} />
            <Route path="/jewellery-repairs" element={<JewelleryRepairs />} />
            <Route path="/auth/login" element={<UserLogin />} />
            <Route path="/auth/register" element={<UserRegister />} />
            
            {/* Admin Login Route */}{/*
            <Route path="/admin/login" element={<AdminLogin />} /> */}
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true} loginPath="/auth/login">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="branches" element={<BranchManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="metals" element={<MetalManagement />} />
              <Route path="gems" element={<GemManagement />} />
              <Route path="requests" element={<ServiceRequests />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reviews" element={<ReviewManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </BrowserRouter>
        <BackToTop />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;