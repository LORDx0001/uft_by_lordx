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
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    let dataLoaded = false;
    let assetsLoaded = false;
    let minTimeElapsed = false;

    const checkFinished = () => {
      if (dataLoaded && assetsLoaded && minTimeElapsed) {
        setFadingOut(true);
        setTimeout(() => setLoading(false), 1000); // Wait for fade-out to complete
      }
    };

    // 1. Min time (1.5s)
    setTimeout(() => {
      minTimeElapsed = true;
      checkFinished();
    }, 1500);

    // 2. Assets (THREE models) - REMOVED since 3D model is gone
    assetsLoaded = true;
    checkFinished();

    // 3. API Data
    const fetchData = async () => {
      try {
        await Promise.allSettled([
          apiRequest("get", "/client/banner"),
          apiRequest("get", "/portfolio/"),
          apiRequest("get", "/portfolio/job/"),
          apiRequest("get", "/portfolio/job/about/"),
          apiRequest("get", "/tools/"),
          apiRequest("get", "/our_services/"),
          apiRequest("get", "/client/comment/"),
          apiRequest("get", "/contact/why-choose-us/"),
          apiRequest("get", "/contact/contact-info/")
        ]);
        dataLoaded = true;
        checkFinished();
      } catch (error) {
        console.error("Critical data fetch failed:", error);
        dataLoaded = true; // Still allow app to show
        checkFinished();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <>
      {loading && <Loading fadingOut={fadingOut} />}
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
    </>
  );
}

export default App;
