import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

export default function SpecificUser() {
  const navigate = useNavigate();
  const location = useLocation();

  // ─── State Hooks ────────────────────────────────────────────────────────────
  const [textValue, setTextValue] = useState("");
  const [fileVersion, setFileVersion] = useState(0);  // mtimeMs from server
  const [loading, setLoading] = useState(true);       // true while GET is in progress
  const [saving, setSaving] = useState(false);        // true while POST is in progress
  const [error, setError] = useState(null);           // any error or conflict message
  const [showReload, setShowReload] = useState(false);// whether to show “Reload” button

//   const getStoredUsername = (index) => {
//       const storedUser = sessionStorage.getItem('user');
//       return storedUser ? storedUser.split('__')[index] : '';
//   };
//   const PASSPHRASE = getStoredUsername(0);

  // ─── A reusable function to fetch latest text & version from server ───────
  const fetchCompanyText = useCallback(async () => {
    setError(null);
    setShowReload(false);
    setLoading(true);

    try {
      const res = await axios.get("/api/company-text");
      if (res.data.success) {


              const password = location.state?.password;
//               const txt = res.data.text;
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+password);
//               const resEnc = await axios.post("/api/encrypt", {
//                 text: txt,
//                 password: password,
//               });
//               const encrVal = resEnc.data.result;
//               if (!resEnc.data.success) {
//                         console.log("!!!!!!_2  Encrypting failed!!!");
//               } else {
//                 console.log("!!!!!!_3  " + encrVal);
//                 const resDec = await axios.post("/api/decrypt", {
//                       text: encrVal,
//                       password: password,
//                 });
//                 const decrVal = resDec.data.result;
//                 if (!resDec.data.success) {
//                     console.log("!!!!!!_4  Dencrypting failed!!!");
//                 }
//                 console.log("!!!!!!_5  " + decrVal);
//               }

        setTextValue(res.data.text);
        setFileVersion(res.data.version);
      } else {
        setError("Failed to load data from server.");
      }
    } catch (err) {
      console.error("GET /api/company-text error:", err);
      setError("Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── 1) On mount, fetch the initial data ────────────────────────────────────
  useEffect(() => {
    fetchCompanyText();
  }, [fetchCompanyText]);

  // ─── 2) Handle “Save” click (POST with version check) ────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setShowReload(false);

    try {
      const payload = {
        text: textValue,
        clientVersion: fileVersion,
      };

      const res = await axios.post("/api/company-text", payload);
      if (res.data.success) {
        // Successfully saved; navigate away
        setFileVersion(res.data.version);
        sessionStorage.clear();
        navigate("/");
      } else {
        // Unlikely without a 409, but just in case:
        setError("Save failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Conflict detected
        const { text: latestText, version: latestVersion } = err.response.data;
        setError(
          "Conflict: The file changed on the server."
        );
        // Pre-fill with the server’s latest content so user can see it
        setTextValue(latestText);
        setFileVersion(latestVersion);
        setShowReload(true); // show the Reload button
      } else {
        console.error("POST /api/company-text error:", err);
        setError("Error saving data.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ─── 3) Handle “Reload” click, to re-fetch latest text from server ─────────
  const handleReload = async () => {
    await fetchCompanyText();
    setError(null);
    setShowReload(false);
  };

  // ─── 4) Handle “Cancel” click ───────────────────────────────────────────────
  const handleCancel = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // ─── 5) Render ───────────────────────────────────────────────────────────────
  return (
    <div className="specific-user-page">
      <div className="form-card">
        <h2 className="form-title">Company Details</h2>

        {loading ? (
          <p style={{ textAlign: "center", margin: "24px 0" }}>Loading…</p>
        ) : (
          <>
            <textarea
              className="input-area"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter your text here..."
            />

            {/* Show any error or conflict message */}
            {error && <p className="error-msg">{error}</p>}

            {/* Show Reload button only if a conflict occurred */}
            {showReload && (
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <button className="btn-reload" onClick={handleReload} disabled={loading} > Reload Latest </button>
              </div>
            )}

            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancel} disabled={saving} > Cancel </button>
              <button className="btn-save" onClick={handleSave} disabled={saving} > {saving ? "Saving…" : "Save"} </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}





/////
// SpecificUser.jsx

// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./App.css";
//
// export default function SpecificUser() {
//   const navigate = useNavigate();
//
//   // ─── Password for encryption/decryption (hard‐coded here for demo) ────────
//   const getStoredUsername = (index) => {
//       const storedUser = sessionStorage.getItem('user');
//       return storedUser ? storedUser.split('__')[index] : '';
//   };
//   const PASSPHRASE = getStoredUsername(0);
//
//   // ─── State Hooks ────────────────────────────────────────────────────────────
//   const [textValue, setTextValue] = useState("");
//   const [fileVersion, setFileVersion] = useState(0);   // mtimeMs from server
//   const [loading, setLoading] = useState(true);        // true while GET+decrypt in progress
//   const [saving, setSaving] = useState(false);         // true while encrypt+POST in progress
//   const [error, setError] = useState(null);            // any error/conflict message
//   const [showReload, setShowReload] = useState(false); // whether to show “Reload” button
//
//   // ─── 1) Fetch encrypted text from server & decrypt it ──────────────────────
//   const fetchAndDecrypt = useCallback(async () => {
//     setError(null);
//     setShowReload(false);
//     setLoading(true);
//
//     try {
//       // 1A) Get the encrypted contents + version token
//       const resGet = await axios.get("/api/company-text");
//       if (!resGet.data.success) {
//         setError("Failed to load data from server.");
//         setLoading(false);
//         return;
//       }
//
//       const encrypted = resGet.data.text;
//       const version = resGet.data.version;
//
//       // 1B) Decrypt it via API
//       const resDec = await axios.post("/api/decrypt", {
//         text: encrypted,
//         password: PASSPHRASE,
//       });
//
//       if (!resDec.data.success) {
//         setError("Decryption failed on server.");
//       } else {
//         setTextValue(resDec.data.result);
//         setFileVersion(version);
//       }
//     } catch (err) {
//       console.error("Error fetching/decrypting company-text:", err);
//       setError("Error loading data.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   // ─── On mount, fetch & decrypt ──────────────────────────────────────────────
//   useEffect(() => {
//     fetchAndDecrypt();
//   }, [fetchAndDecrypt]);
//
//   // ─── 2) Handle “Save” click: encrypt textarea content & POST to server ───────
//   const handleSave = async () => {
//     setSaving(true);
//     setError(null);
//     setShowReload(false);
//
//     try {
//       // 2A) Encrypt the plaintext from textarea
//       const resEnc = await axios.post("/api/encrypt", {
//         text: textValue,
//         password: PASSPHRASE,
//       });
//
//       if (!resEnc.data.success) {
//         setError("Encryption failed on server.");
//         setSaving(false);
//         return;
//       }
//
//       const encryptedToSave = resEnc.data.result;
//
//       // 2B) Send the ciphertext + version token to /api/company-text
//       const resSave = await axios.post("/api/company-text", {
//         text: encryptedToSave,
//         clientVersion: fileVersion,
//       });
//
//       if (resSave.data.success) {
//         // Successfully saved; navigate away
//         setFileVersion(resSave.data.version);
//         sessionStorage.clear();
//         navigate("/");
//       } else {
//         // Unlikely without a 409, but handle fallback
//         setError("Save failed. Please try again.");
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 409) {
//         // Conflict: server’s ciphertext changed since we loaded
//         const { text: latestCipher, version: latestVersion } = err.response.data;
//
//         setError("Conflict: The file changed on the server.");
//         // Decrypt the new ciphertext so the user sees latest plaintext
//         try {
//           const resDec2 = await axios.post("/api/decrypt", {
//             text: latestCipher,
//             password: PASSPHRASE,
//           });
//           if (resDec2.data.success) {
//             setTextValue(resDec2.data.result);
//             setFileVersion(latestVersion);
//           } else {
//             setError("Decryption failed after conflict.");
//           }
//         } catch (decryptErr) {
//           console.error("Error decrypting latest after conflict:", decryptErr);
//           setError("Error decrypting latest version.");
//         }
//
//         setShowReload(true);
//       } else {
//         console.error("POST /api/company-text error:", err);
//         setError("Error saving data.");
//       }
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   // ─── 3) Handle “Reload Latest” click ─────────────────────────────────────────
//   const handleReload = async () => {
//     await fetchAndDecrypt();
//     setError(null);
//     setShowReload(false);
//   };
//
//   // ─── 4) Handle “Cancel” click ───────────────────────────────────────────────
//   const handleCancel = () => {
//     sessionStorage.clear();
//     navigate("/");
//   };
//
//   // ─── 5) Render ───────────────────────────────────────────────────────────────
//   return (
//     <div className="specific-user-page">
//       <div className="form-card">
//         <h2 className="form-title">Company Details</h2>
//
//         {loading ? (
//           <p style={{ textAlign: "center", margin: "24px 0" }}>Loading…</p>
//         ) : (
//           <>
//             <textarea
//               className="input-area"
//               value={textValue}
//               onChange={(e) => setTextValue(e.target.value)}
//               placeholder="Enter your text here..."
//             />
//
//             {/* Show any error or conflict message */}
//             {error && <p className="error-msg">{error}</p>}
//
//             {/* Show Reload button only if a conflict occurred */}
//             {showReload && (
//               <div style={{ textAlign: "center", marginBottom: "12px" }}>
//                 <button
//                   className="btn-reload"
//                   onClick={handleReload}
//                   disabled={loading}
//                 >
//                   Reload Latest
//                 </button>
//               </div>
//             )}
//
//             <div className="form-actions">
//               <button
//                 className="btn-cancel"
//                 onClick={handleCancel}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn-save"
//                 onClick={handleSave}
//                 disabled={saving}
//               >
//                 {saving ? "Saving…" : "Save"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
//
//
