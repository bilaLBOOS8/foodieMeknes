import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from 'sonner'
import Layout from "@/components/Layout"
import Home from "@/pages/Home"
import Menu from "@/pages/Menu"
import Cart from "@/pages/Cart"
import OrderConfirmation from "@/pages/OrderConfirmation"
import Contact from "@/pages/Contact"
import AdminLogin from "@/pages/admin/Login"
import AdminDashboard from "@/pages/admin/Dashboard"
import AdminMenu from "@/pages/admin/Menu"
import AdminCategories from "@/pages/admin/Categories"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/menu" element={<Layout><Menu /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/menu" element={
          <ProtectedRoute>
            <AdminMenu />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}
