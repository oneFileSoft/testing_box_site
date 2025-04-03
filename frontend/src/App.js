// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Login';
// import Home from './Home';
// import { useEffect } from 'react';

// export default function App() {
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       console.log("Page is refreshing. Clearing session storage.");
//       sessionStorage.clear();
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);


import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import AboutUs from "./AboutUs";
import User from "./User";
import UserDetails from "./UserDetails"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="contact" element={<Contact />} />
        <Route path="about_us" element={<AboutUs />} />
        <Route path="user" element={<User />} />
        <Route path="user_details" element={<UserDetails />} />
      </Route>
    </Routes>
  );
}









