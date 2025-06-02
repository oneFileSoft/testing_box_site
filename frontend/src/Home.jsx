import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useInactivityRedirect from "./utils/useInactivityRedirect";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { showToastSuccess } from "./utils/toastUtils";
import ImageCarousel from "./ImageCarousel";

export default function Home() {
  useEffect(() => {
    document.title = "testing area 51";
  }, []);

  useInactivityRedirect(60000, "/");

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [showCarousel, setShowCarousel] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Visitor counter effect (run once)
    fetch("/api/visitor-count", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count))
      .catch(console.error);
  }, []);

  useEffect(() => {
    let timer;
    let ignoreNextClick = false;

    const scheduleShow = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("User inactive — showing carousel");
        setShowCarousel(true);
      }, 5000);
    };

    const reset = (e) => {
      if (carouselRef.current?.contains(e.target)) return;

      if (ignoreNextClick) {
        console.log("Ignoring first click after zoom exit");
        ignoreNextClick = false;
        return;
      }

      setShowCarousel(false);
      scheduleShow();
    };

    scheduleShow();
    window.addEventListener("click", reset);
    window.addEventListener("keydown", reset);

    const zoomedImgs = document.querySelectorAll(".carousel-image-container img");
    const handleZoomExit = () => {
      if (window.innerWidth < 768) {
        ignoreNextClick = true;
      }
    };
    zoomedImgs.forEach((img) => {
      img.addEventListener("touchstart", handleZoomExit);
      img.addEventListener("click", handleZoomExit);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", reset);
      window.removeEventListener("keydown", reset);
      zoomedImgs.forEach((img) => {
        img.removeEventListener("touchstart", handleZoomExit);
        img.removeEventListener("click", handleZoomExit);
      });
    };
  }, []);

  const handleDoubleClick = () => {
    navigate("/");
    navigate(location.pathname, { replace: true });
  };
  const handleHomeClick = () => {
    navigate("/");
    fetch(`/version.txt?ts=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.text())
      .then((txt) => showToastSuccess(txt.trim()))
      .catch(() => {});
  };
  const handleContactClick = () => navigate("/contact");
  const handleJenkinsClick = () => navigate("/about_us");
  const handleDbClick = () => {
    sessionStorage.clear();
    navigate("/user");
  };
  const handleStorageClick = () => {
    sessionStorage.clear();
    navigate("/session_storage");
  };
  const handleRegrClick = () => navigate("/regression-report");

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="top-bar">
          <img
            src="/img/home_9243286.png"
            alt="Home"
            className={`bar-icon w-8 h-8 cursor-pointer ${isHome ? "dim-icon" : ""}`}
            onClick={handleHomeClick}
            onDoubleClick={handleDoubleClick}
          />
          <img
            src="/img/contactUs_16769119.png"
            alt="Contact"
            className={`bar-icon w-8 h-8 cursor-pointer ${
              location.pathname === "/contact" ? "dim-icon" : ""
            }`}
            onClick={handleContactClick}
          />
          <img
            src="/img/jenkins_5529124.png"
            alt="About Jenkins"
            className={`bar-icon w-8 h-8 cursor-pointer ${
              location.pathname === "/about_us" ? "dim-icon" : ""
            }`}
            onClick={handleJenkinsClick}
          />
          <img
            src="/img/settings_16311406.png"
            alt="User-DB"
            className={`bar-icon w-8 h-8 cursor-pointer ${
              location.pathname === "/user" ? "dim-icon" : ""
            }`}
            onClick={handleDbClick}
          />
          <img
            src="/img/privacy-icon.png"
            alt="Storage"
            className={`bar-icon w-8 h-8 cursor-pointer ${
              location.pathname === "/session_storage" ? "dim-icon" : ""
            }`}
            onClick={handleStorageClick}
          />
          <img
            src="/img/seo-report_7605135.png"
            alt="RegrReport"
            className={`bar-icon w-8 h-8 cursor-pointer ${
              location.pathname === "/regression-report" ? "dim-icon" : ""
            }`}
            onClick={handleRegrClick}
          />
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`main-content ${isHome ? "dim-background" : ""}`}
        style={{ height: "97%" }}
      >
        <div
          className="content-container"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            className="min-h-0"
            style={{
              width: "90%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Outlet />

            {isHome && (
              <div
                ref={carouselRef}
                className={`carousel-container ${showCarousel ? "visible" : "hidden"}`}
              >
                <div className="carousel-scroll-wrapper">
                  <ImageCarousel />
                </div>
              </div>
            )}
          </div>
        </div>

        <ToastContainer />
      </main>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          height: "3%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <div className="visitor-counter" style={{ fontSize: "0.85rem" }}>
          {visitorCount !== null ? `👁${visitorCount}` : "Loading..."}
        </div>
        <a name="trustbadge" href="https://trustlock.co">
          <img
            name="trustseal"
            alt="Trust Badges"
            style={{ border: 0 }}
            src="https://trustlock.co/wp-content/uploads/2019/01/satisisfaction-guaranteed-badge-icon.png"
            width="100"
          />
        </a>
      </footer>
    </div>
  );
}


// import React, { useEffect, useState, useRef } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import useInactivityRedirect from "./utils/useInactivityRedirect";
// import "./App.css";
// import { ToastContainer } from "react-toastify";
// import { showToastSuccess } from "./utils/toastUtils";
// import ImageCarousel from "./ImageCarousel";
//
// export default function Home() {
//   // Set document title
//   useEffect(() => {
//     document.title = "testing area 51";
//   }, []);
//
//   // Redirect after 60s inactivity
//   useInactivityRedirect(60000, "/");
//
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isHome = location.pathname === "/";
//
//   // Carousel visibility + ref
//   const [showCarousel, setShowCarousel] = useState(false);
//   const carouselRef = useRef(null);
//
//   useEffect(() => {
//     let timer;
//
//     // Show carousel after 5s
//     const scheduleShow = () => {
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//         console.log("User inactive — showing carousel");
//         setShowCarousel(true);
//       }, 5000);
//     };
//
//     // Hide and restart on click or key (unless inside carousel)
//     const reset = (e) => {
//       if (carouselRef.current?.contains(e.target)) return;
//       setShowCarousel(false);
//       scheduleShow();
//     };
//
//     scheduleShow();
//     window.addEventListener("click", reset);
//     window.addEventListener("keydown", reset);
//
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener("click", reset);
//       window.removeEventListener("keydown", reset);
//     };
//   }, []);
//
//   // Navigation handlers
//   const handleDoubleClick = () => {
//     navigate("/");
//     navigate(location.pathname, { replace: true });
//   };
//   const handleHomeClick = () => {
//     navigate("/");
//     fetch(`/version.txt?ts=${Date.now()}`, { cache: "no-store" })
//       .then((res) => res.text())
//       .then((txt) => showToastSuccess(txt.trim()))
//       .catch(() => {});
//   };
//   const handleContactClick = () => navigate("/contact");
//   const handleJenkinsClick = () => navigate("/about_us");
//   const handleDbClick = () => {
//     sessionStorage.clear();
//     navigate("/user");
//   };
//   const handleStorageClick = () => {
//     sessionStorage.clear();
//     navigate("/session_storage");
//   };
//   const handleRegrClick = () => navigate("/regression-report");
//
//   return (
//     <div className="home-container">
//       {/* Header */}
//       <header className="header">
//         <div className="top-bar">
//           <img
//             src="/img/home_9243286.png"
//             alt="Home"
//             className={`bar-icon w-8 h-8 cursor-pointer ${
//               isHome ? "dim-icon" : ""
//             }`}
//             onClick={handleHomeClick}
//             onDoubleClick={handleDoubleClick}
//           />
//           <img
//             src="/img/contactUs_16769119.png"
//             alt="Contact"
//             className={`bar-icon w-8 h-8 cursor-pointer ${
//               location.pathname === "/contact" ? "dim-icon" : ""
//             }`}
//             onClick={handleContactClick}
//           />
//           <img
//             src="/img/jenkins_5529124.png"
//             alt="About Jenkins"
//             className={`bar-icon w-8 h-8 cursor-pointer ${
//               location.pathname === "/about_us" ? "dim-icon" : ""
//             }`}
//             onClick={handleJenkinsClick}
//           />
//           <img
//             src="/img/settings_16311406.png"
//             alt="User-DB"
//             className={`bar-icon w-8 h-8 cursor-pointer ${
//               location.pathname === "/user" ? "dim-icon" : ""
//             }`}
//             onClick={handleDbClick}
//           />
//           <img
//             src="/img/privacy-icon.png"
//             alt="Storage"
//             className={`bar-icon w-8 h-8 cursor-pointer ${
//               location.pathname === "/session_storage" ? "dim-icon" : ""
//             }`}
//             onClick={handleStorageClick}
//           />
//           <img
//             src="/img/seo-report_7605135.png"
//             alt="RegrReport"
//             className={`bar-icon w-8 h-8 cursor-pointer ${
//               location.pathname === "/regression-report" ? "dim-icon" : ""
//             }`}
//             onClick={handleRegrClick}
//           />
//         </div>
//       </header>
//
//       {/* Main Content */}
//       <main
//         className={`main-content ${isHome ? "dim-background" : ""}`}
//         style={{ height: "97%" }}
//       >
//         <div
//           className="content-container"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           <div
//             className="min-h-0"
//             style={{
//               width: "90%",
//               height: "100%",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Outlet />
//
//             {/* Carousel: always in tree on “/” but fade via CSS */}
//             {isHome && (
//               <div
//                 ref={carouselRef}
//                 className={`carousel-container ${
//                   showCarousel ? "visible" : "hidden"
//                 }`}
//                 style={{ marginTop: "30px" }}
//               >
//                 <ImageCarousel />
//               </div>
//             )}
//           </div>
//         </div>
//
//         <ToastContainer />
//       </main>
//
//       {/* Footer */}
//       <footer className="footer" style={{ height: "3%", textAlign: "right" }}>
//         <a name="trustbadge" href="https://trustlock.co">
//           <img
//             name="trustseal"
//             alt="Trust Badges"
//             style={{ border: 0 }}
//             src="https://trustlock.co/wp-content/uploads/2019/01/satisisfaction-guaranteed-badge-icon.png"
//             width="100"
//           />
//         </a>
//         &nbsp;
//       </footer>
//     </div>
//   );
// }












// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import useInactivityRedirect from './utils/useInactivityRedirect';
// import './App.css';
// import { ToastContainer } from "react-toastify";
// import { showToastSuccess, showToastError } from './utils/toastUtils';
//
// export default function Home() {
//   useEffect(() => {
//     document.title = "testing area 51";
//   }, []);
//
//   useInactivityRedirect(60000, '/');
//
//   const location = useLocation();
//   const isHome = location.pathname !== "/";
//   const currentLoc = location.pathname;
//   const navigate = useNavigate();
//
//   const handleDoubleClick = () => { navigate("/"); navigate(location.pathname, { replace: true }); }
//   const handleHomeClick = () => {
//      navigate("/");
//      // fetch fresh version.txt on every click
//      fetch(`/version.txt?ts=${Date.now()}`, { cache: 'no-store' })
//        .then(res => res.text())
//        .then(txt => {
//          showToastSuccess(txt.trim());
//        })
//     .catch(() => { });
//   };
//   const handleContactClick = () => navigate('/contact');
//   const handleJenkinsClick = () => navigate('/about_us');
//   const handleDbClick = () => { sessionStorage.clear(); navigate('/user'); }
//   const handleStorageClick = () => { sessionStorage.clear(); navigate('/session_storage'); }
//   const handleRegrClick = () => navigate('/regression-report');
//
//   return (
//     <div className="home-container" >
//       {/* Header */}
//       <header className="header" >
//         <div className="top-bar">
//           <img src="/img/home_9243286.png" alt="Home" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/" ? "dim-icon" : ""}`} onClick={handleHomeClick} onDoubleClick={handleDoubleClick}/>
//           {/*<a href="https://www.freepik.com/icon/house-chimney_9243286">Icon by UIcons</a>*/}
//           <img src="/img/contactUs_16769119.png" alt="Contact" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/contact" ? "dim-icon" : ""}`} onClick={handleContactClick} />
//           {/*<a href="https://www.freepik.com/icon/clip-mail_16769119#fromView=search&page=3&position=31&uuid=43f68ff2-180d-4ce0-9887-8f952acbaf88">Icon by UIcons</a> */}
//           <img src="/img/jenkins_5529124.png" alt="About Jenkins" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/about_us" ? "dim-icon" : ""}`} onClick={handleJenkinsClick} />
//           {/*<a href="https://www.freepik.com/icon/users-alt_5529124#fromView=search&page=5&position=51&uuid=9e36625c-161e-4109-b420-ccbe393fc2ea">Icon by UIcons</a>*/}
//           <img src="/img/settings_16311406.png" alt="User-DB" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/user" ? "dim-icon" : ""}`} onClick={handleDbClick} />
//           {/* <a href="https://www.freepik.com/icon/user-skill-gear_16311406#fromView=search&page=5&position=3&uuid=9e36625c-161e-4109-b420-ccbe393fc2ea">Icon by UIcons</a> */}
//           <img src="/img/privacy-icon.png" alt="Storage" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/session_storage" ? "dim-icon" : ""}`} onClick={handleStorageClick} />
//           {/* <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 498 512.17"><path d="M232.21 0c86.9 55.08 165.4 81.14 232.78 74.98 3.67 74.22-2.36 138.96-17.12 194.7-10-4.08-20.68-6.52-31.7-7 11.57-46.07 16.23-99.25 13.23-159.92-57.04 5.22-123.5-16.84-197.06-63.48C168.68 88.73 103 103.21 36.04 99.7c-2.97 113.09 16.9 198.24 55.29 260.18 28.38-23.73 76.71-20.15 99.6-51.62 1.65-2.43 2.41-3.74 2.39-4.81-.01-.56-24.83-31-27.06-34.55-5.85-9.3-16.8-21.93-16.8-32.82 0-6.15 4.85-14.17 11.8-15.96-.54-9.22-.91-18.57-.91-27.84 0-5.47.1-11.01.3-16.43.3-3.44.94-4.95 1.85-8.27a58.537 58.537 0 0 1 26.13-33.18c4.43-2.8 9.25-4.98 14.19-6.77 8.96-3.27 4.62-17.43 14.46-17.65 22.99-.59 60.81 19.51 75.54 35.48 9.39 10.38 14.75 21.92 15.07 35.92l-.93 40.27c4.08 1 8.66 4.19 9.66 8.28 3.15 12.71-10.04 28.53-16.18 38.64-5.65 9.33-27.26 34.79-27.28 35-.1 1.09.46 2.47 1.94 4.69 10.53 14.48 26.44 21.54 43.3 27.25-1.87 6.71-3.07 13.64-3.53 20.74-1.76 1.23-3.4 2.6-4.91 4.11l-.1.1c-6.73 6.75-10.93 16.04-10.93 26.26v93.19c-20.32 12.65-42.28 23.4-65.81 32.26C82.71 457.27-6.26 322.77.34 71.37 79.43 75.51 157.03 58.41 232.21 0zm105.67 375.54h3.88v-11.95c0-19.96 7.87-38.16 20.55-51.39 12.79-13.33 30.44-21.6 49.88-21.6s37.11 8.27 49.88 21.6c12.69 13.23 20.56 31.42 20.56 51.39v11.95h3.88c6.32 0 11.49 5.18 11.49 11.5v113.63c0 6.33-5.17 11.5-11.49 11.5H337.88c-6.33 0-11.49-5.17-11.49-11.5V387.04c-.01-6.32 5.16-11.5 11.49-11.5zm65.2 73.48-11.96 31.34h42.13l-11.08-31.77c7.04-3.62 11.85-10.95 11.85-19.41 0-12.06-9.77-21.82-21.84-21.82-12.05 0-21.82 9.76-21.82 21.82 0 8.8 5.21 16.38 12.72 19.84zm-39.57-73.48h97.35v-11.95c0-14.2-5.53-27.06-14.43-36.34-8.81-9.19-20.93-14.9-34.24-14.9-13.31 0-25.44 5.71-34.24 14.9-8.91 9.28-14.44 22.14-14.44 36.34v11.95z"/></svg> */}
//           <img src="/img/seo-report_7605135.png" alt="RegrReport" className={`bar-icon w-8 h-8 cursor-pointer ${currentLoc === "/regression-report" ? "dim-icon" : ""}`} onClick={handleRegrClick} />
//         </div>
//       </header>
//
//       <main className={`main-content ${isHome ? "dim-background" : ""}`}   style={{ height: '97%' }}>
//         <div className="content-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
//           <div style={{ width: '90%', height: '100%', alignItems: 'center', justifyContent: 'center' }} class="min-h-0">
//             <Outlet />
//           </div>
//         </div>
//         <ToastContainer />
//       </main>
//
//
//       {/* Footer */}
//       <footer className="footer" style={{ height: '3%', textAlign: "right"}}>
//         <a name="trustbadge" href="https://trustlock.co"> <img name="trustseal" alt="Trust Badges" style={{ border: 0 }} src="https://trustlock.co/wp-content/uploads/2019/01/satisisfaction-guaranteed-badge-icon.png" width="100" />
//         </a>&nbsp;
//       </footer>
//     </div>
//   );
// }



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
//   const handleJenkinsClick = () => navigate('/about_us');
//   const handleDbClick = () => {sessionStorage.clear(); navigate('/user'); }
//
//   return (
//     <div className={`home-container ${isHome ? "dim-background" : ""}`} >
//
//       <div className="top-bar flex items-center justify-between bg-white shadow-md px-4 py-2 fixed top-0 left-0 w-full z-50">
//         <div className="flex items-center space-x-4">
//           <img src="/img/home-b.png"   alt="Home"     className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "" : "dim-icon"}`} onClick={handleHomeClick}  />
//           <img src="/img/contact.png"  alt="Contact"  className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "dim-icon" : ""}`} onClick={handleContactClick} />
//           <img src="/img/aboutUs.png"  alt="About Us" className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "dim-icon" : ""}`} onClick={handleJenkinsClick} />
//           <img src="/img/settings.png" alt="Settings" className={`bar-icon w-8 h-8 cursor-pointe; ${isHome ? "dim-icon" : ""}`} onClick={handleDbClick} />
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
