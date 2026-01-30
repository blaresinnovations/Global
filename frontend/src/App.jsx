import { useState , useEffect} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import AdminPanel from "./pages/Admin/AdminPanel";
import LecturerPanel from "./pages/AdminLec/LecturerPanel";
import LecturerSession from "./pages/AdminLec/LecturerSession";
import RequireAuth from "./components/RequireAuth";
import NewInquiries from "./pages/NewInquiries";
import StudentPanel from "./pages/AdminST/StudentPanel";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Eng from "./pages/Eng";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";



function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const location = useLocation();

     useEffect(() => {
    setIsLoading(true); // Show preloader on every navigation
  }, [location.pathname]);

  // Pages where we want to hide Navbar + Footer
  // add routes here where navbar/footer should be hidden
  const hideLayoutRoutes = ["/login", "/signup", "/admin", "/lecturer", "/student", "/reset-password"];

  // Check if current path matches any in hideLayoutRoutes
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className={`bg-[#0c162c] min-h-screen ${isLoading ? "preloading" : ""}`}>
      
      <Preloader key={location.pathname} onComplete={() => setIsLoading(false)} />
      {/* Main content hidden during loading */}
      {!isLoading && (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/app" element={<Eng />} />


        <Route path="/admin" element={<RequireAuth role="admin"><AdminPanel /></RequireAuth>} />
        <Route path="/lecturer" element={<RequireAuth role="lecturer"><LecturerPanel /></RequireAuth>} />
        <Route path="/lecturer/session/:id" element={<RequireAuth role="lecturer"><LecturerSession /></RequireAuth>} />
        <Route path="/inquiries" element={<NewInquiries/>} />
        <Route path="/student" element={<RequireAuth role="student"><StudentPanel /></RequireAuth>} />

        <Route path="/privacy" element={<PrivacyPolicy/>} />
        <Route path="/terms" element={<TermsConditions />} />
        
      </Routes>
      {!hideLayout && <Footer />}
    </>
    )}
    </div>
  );
}

export default App;
