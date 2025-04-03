import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useInactivityRedirect from './utils/useInactivityRedirect';
import './App.css';

export default function Home() {
  useEffect(() => {
    document.title = "Arbatrade.us"; // Set the title here
  }, []);

  useInactivityRedirect(60000, '/');

  const location = useLocation();
  const isHome = location.pathname !== "/";
  const currentLoc = location.pathname;
  const navigate = useNavigate();

  const handleHomeClick = () => navigate('/');
  const handleContactClick = () => navigate('/contact');
  const handleAboutUsClick = () => navigate('/about_us');
  const handleSettingsClick = () => { sessionStorage.clear(); navigate('/user'); }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header" >
        <div className="top-bar">
          <img src="/img/home_9243286.png" alt="Home" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/" ? "dim-icon" : ""}`} onClick={handleHomeClick} />
          {/*<a href="https://www.freepik.com/icon/house-chimney_9243286">Icon by UIcons</a>*/}
          <img src="/img/contactUs_16769119.png" alt="Contact" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/contact" ? "dim-icon" : ""}`} onClick={handleContactClick} />
          {/*<a href="https://www.freepik.com/icon/clip-mail_16769119#fromView=search&page=3&position=31&uuid=43f68ff2-180d-4ce0-9887-8f952acbaf88">Icon by UIcons</a> */}
          <img src="/img/aboutUs_5529124.png" alt="About Us" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/about_us" ? "dim-icon" : ""}`} onClick={handleAboutUsClick} />
          {/*<a href="https://www.freepik.com/icon/users-alt_5529124#fromView=search&page=5&position=51&uuid=9e36625c-161e-4109-b420-ccbe393fc2ea">Icon by UIcons</a>*/}
          <img src="/img/settings_16311406.png" alt="Settings" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/user" ? "dim-icon" : ""}`} onClick={handleSettingsClick} />
          {/* <a href="https://www.freepik.com/icon/user-skill-gear_16311406#fromView=search&page=5&position=3&uuid=9e36625c-161e-4109-b420-ccbe393fc2ea">Icon by UIcons</a> */}
        </div>
      </header>

      {/* Body */}
      <main className={`main-content ${isHome ? "dim-background" : ""}`}   style={{ height: '97%' }}>
        <div className="content-container" style={{ width: '100%' }}>
          <div style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer" style={{ height: '3%', textAlign: "right"}}>
        <a name="trustbadge" href="https://trustlock.co" ><img name="trustseal" alt="Trust Badges" style={{ border: 0 }} src="https://trustlock.co/wp-content/uploads/2019/01/satisisfaction-guaranteed-free-website-trust-badges-3.png"
        width="50"/></a>
        &nbsp;

        <a name="trustbadge" href="https://trustlock.co"> <img name="trustseal" alt="Trust Badges" style={{ border: 0 }} src="https://trustlock.co/wp-content/uploads/2019/01/satisisfaction-guaranteed-badge-icon.png" width="100" />
        </a>&nbsp;
      </footer>
    </div>
  );
}



//
//
// import React from "react";
// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// import { useState, useRef, useEffect } from 'react';
// import useInactivityRedirect from './utils/useInactivityRedirect';
// import './App.css';
//
// export default function Home() {
//   useEffect(() => {
//     document.title = "Arbatrade.us";  // 🔥 Set the title here   here::::: is new comment for same file
//   }, []);
//   useInactivityRedirect(60000, '/');
//
//   const location = useLocation();
//   const isHome = location.pathname !== "/";
//   const navigate = useNavigate(); // Initialize navigate function and here too
//
//   const handleHomeClick = () => {navigate('/'); }
//   const handleContactClick = () => navigate('/contact');
//   const handleAboutUsClick = () => navigate('/about_us');
//   const handleSettingsClick = () => {sessionStorage.clear(); navigate('/user'); }
//
//   return (
//     <div className={`home-container ${isHome ? "dim-background" : ""}`} >
//
//       <div className="top-bar flex items-center justify-between bg-white shadow-md px-4 py-2 fixed top-0 left-0 w-full z-50">
//         <div className="flex items-center space-x-4">
//           <img src="/img/home-b.png"   alt="Home"     className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "" : "dim-icon"}`} onClick={handleHomeClick}  />
//           <img src="/img/contact.png"  alt="Contact"  className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "dim-icon" : ""}`} onClick={handleContactClick} />
//           <img src="/img/aboutUs.png"  alt="About Us" className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "dim-icon" : ""}`} onClick={handleAboutUsClick} />
//           <img src="/img/settings.png" alt="Settings" className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "dim-icon" : ""}`} onClick={handleSettingsClick} />
//         </div>
//       </div>
//
//       <div className="content-container" style={{ width: '100%' }}>
//         <div style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outlet for nested route rendering */}
//           <Outlet />
//         </div>
//       </div>
//
//     </div>
//   );
// }
//
//
//
//
//
//
//
