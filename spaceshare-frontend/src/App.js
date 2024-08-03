import React from "react";
import Home from "./views/home/home";
import Navbar from "./components/navbar/navbar";
import Signin from "./views/authentication/signin";
import Signup from "./views/authentication/signup";
import ForgotPassword from "./views/authentication/forgotPassword";
import ResetPassword from "./views/authentication/resetPassword";
import Reserve from "./views/reservation/reserve";
import Faq from "./views/faq/faq";
import Footer from "./components/footer/footer";
import Dashboard from "./views/dashboard/dashboard";
import RequireAuth from "./utils/RequireAuth";
import Results from "./views/result/results";
import History from "./views/history/history";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./views/contact/contact";

const ROLES = {
  USER: "user",
  SPACE_OWNER: "space owner",
};

function App() {
  return (
    <div className="r">
      <Router>
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Results />} />{" "}
          {/* Ensure Results route is set */}
          {/* protect routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />} />
          <Route path="/history" element={<History />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.SPACE_OWNER]} />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.SPACE_OWNER]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.USER, ROLES.SPACE_OWNER]} />
            }
          ></Route>
          <Route path="/faq" element={<Faq />} />
          <Route path="/reserve" element={<Reserve />} />
        </Routes>
      </Router>
      <Footer className="b" />
    </div>
  );
}

export default App;
