import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { TopNav } from "./components/layout/TopNav";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Earn from "./pages/Earn";
import Redeem from "./pages/Redeem";
import Status from "./pages/Status";
import Activity from "./pages/Activity";
import Join from "./pages/Join";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <TopNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/status" element={<Status />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/join" element={<Join />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
