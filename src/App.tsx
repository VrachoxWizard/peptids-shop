import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proizvodi" element={<Products />} />
        <Route path="/kosarica" element={<Cart />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/proizvod/:slug" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;
