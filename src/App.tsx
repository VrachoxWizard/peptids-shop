import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/proizvodi" element={<Products />} />

          <Route path="/proizvod/:slug" element={<ProductDetails />} />

          <Route path="/kosarica" element={<Cart />} />

          <Route path="/kontakt" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />

      <Toaster position="bottom-right" richColors closeButton theme="dark" />
    </div>
  );
}

export default App;
