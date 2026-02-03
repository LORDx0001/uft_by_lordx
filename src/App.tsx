import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer";
import Loading from "./components/Loading.tsx";
import { apiRequest } from "../api/apiRequest";
import Home from "./pages/Home.tsx";
import { useEffect, useState } from "react";
import AOS from "aos";
import { Toaster } from "react-hot-toast";
import "./i18n/i18n";
import "aos/dist/aos.css";
import Portfolio from "./pages/Portfolio.tsx";
import { AboutUs } from "./pages/AboutUs.tsx";
import PageNotFound from "./components/PageNotFound.tsx";

AOS.init();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch critical data before hiding loader
        await Promise.allSettled([
          apiRequest("get", "/client/banner"),
          apiRequest("get", "/portfolio/"),
          apiRequest("get", "/portfolio/job/"),
          apiRequest("get", "/tools/"),
          apiRequest("get", "/our_services/")
        ]);
      } catch (error) {
        console.error("Critical data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <Router>
      <div className="">
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
