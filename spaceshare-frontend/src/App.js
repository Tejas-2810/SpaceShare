import "./App.css";
import React from "react";
import Home from "./views/home/home";
import Navbar from "./components/navbar/navbar";
import Signin from "./views/authentication/signin";
import Signup from "./views/authentication/signup";
import ForgotPassword from "./views/authentication/forgotPassword";
import ResetPassword from "./views/authentication/resetPassword";
import Footer from "./components/footer/footer";
import Dashboard from "./views/dashboard/dashboard";
import RequireAuth from "./utils/RequireAuth";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

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

          {/* protect routes */}
          {/* user routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />}>
      
          </Route>
          {/* space owner route */}
          <Route element={<RequireAuth allowedRoles={[ROLES.SPACE_OWNER]} />}>
          <Route path="/dashboard" element={<Dashboard />} />

          </Route>
          {/* common routes */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.USER, ROLES.SPACE_OWNER]}
              />
            }
          >
          </Route>
          
        </Routes>
      </Router>
      <Footer className="b" />
    </div>
  );
}

export default App;
