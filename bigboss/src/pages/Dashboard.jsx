import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import verifySuccess from "../assets/verify-success.json";
import verifyFail from "../assets/verify-fail.json";
import bsfLogo from "../assets/bsf.png";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import { collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";


import "../App.css";

function Dashboard() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Guest");
  const [animationType, setAnimationType] = useState(null);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user && user.displayName) {
     
      localStorage.setItem("userName", user.displayName);
      setUserName(user.displayName);
    } else {
      setUserName("Guest");
    }
  });

  return () => unsub();
}, []);
  const [fields, setFields] = useState({
    first: ["", "", ""],
    second: ["", "", "", "", ""],
    third: ["", "", "", ""],
  });

  const unsubRef = useRef(null); 

  
  const handleLogout = async () => {
  try {
    await signOut(auth); 
    localStorage.removeItem("userName"); 
    toast.success("You have been logged out");
    window.location.href = "/login"; 
  } catch (error) {
    console.error(error);
    toast.error("Failed to log out. Try again.");
  }
};

  
  const handleChange = (e, section, index) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const updated = { ...fields };
    updated[section][index] = val.slice(-1);
    setFields(updated);

    const flatIndex =
      (section === "first" ? 0 : section === "second" ? 3 : 8) + index;
    const nextIndex = flatIndex + 1;

    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleKeyDown = (e, section, index) => {
    if (e.key === "Backspace") {
      const updated = { ...fields };

      if (fields[section][index]) {
        updated[section][index] = "";
        setFields(updated);
        return;
      }

      const flatIndex =
        (section === "first" ? 0 : section === "second" ? 3 : 8) + index;
      const prevIndex = flatIndex - 1;

      if (prevIndex >= 0 && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex].focus();

        const allSections = ["first", "second", "third"];
        let runningIndex = prevIndex;
        for (let s of allSections) {
          const len = fields[s].length;
          if (runningIndex < len) {
            updated[s][runningIndex] = "";
            break;
          } else {
            runningIndex -= len;
          }
        }
        setFields(updated);
      }
    }
  };

  
  const handleSubmit = (e) => {
  e.preventDefault();

  // Format like BSF123-45678-9012
  const formattedChequeId = `BSF${fields.first.join("")}-${fields.second.join("")}-${fields.third.join("")}`;
  
 
  if (unsubRef.current) {
    unsubRef.current();
    unsubRef.current = null;
  }

  if (!/^[A-Za-z0-9-]+$/.test(formattedChequeId)) {
    setAnimationType("fail");
    toast.error("Invalid cheque format!");
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setTimeout(() => setAnimationType(null), 2000);
    return;
  }

  
  const chequeQuery = query(
    collection(db, "cheques"),
    where("chequeId", "==", formattedChequeId),
    limit(1)
  );

  unsubRef.current = onSnapshot(chequeQuery, (snapshot) => {
    if (snapshot.empty) {
      setAnimationType("fail");
      toast.error("Cheque not found ❌");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setAnimationType(null), 2000);
      return;
    }

    const cheque = snapshot.docs[0].data();
    const status = String(cheque.status || "").toLowerCase();

    if (status === "valid") {
      setAnimationType("success");
      toast.success("Cheque is VALID ✅");
    } else {
      setAnimationType("fail");
      toast.error("Cheque is NOT valid because its paid❌");
    }

    setTimeout(() => setAnimationType(null), 2500);
  });
};


  
  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  return (
    <div className="dashboard-container scrollable-dashboard">
     
      <header className="glass-header">
        <div className="header-left">
          <img src={bsfLogo} alt="BSF Logo" className="bsf-logo" />
          <div>
            <h1 className="header-title">BSF Cheque Verification</h1>
            <p className="header-subtitle">
              Trusted digital verification by Black Stone Foods
            </p>
          </div>
        </div>

        <div className="header-right">
          <span className="user-greet">
            {userName === "Guest" ? "Hello Guest" : `Hello, ${userName}`}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      
      <main className="dashboard-main">
        <div className="glass-card verification-card">
          <h3 className="verification-heading">Cheque Verification</h3>
          <p className="verification-sub">
            Enter your cheque number below in the correct format:
          </p>
          <p className="format-example">BSF001 - 12345 - 2025</p>

          <form className="cheque-form" onSubmit={handleSubmit}>
            <div className={`cheque-input-wrapper ${shake ? "shake" : ""}`}>
              <div className="prefix">BSF</div>

             
              {fields.first.map((digit, i) => (
                <input
                  key={`first-${i}`}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="digit-input"
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, "first", i)}
                  onKeyDown={(e) => handleKeyDown(e, "first", i)}
                />
              ))}

              <span className="hyphen">-</span>

              
              {fields.second.map((digit, i) => (
                <input
                  key={`second-${i}`}
                  ref={(el) => (inputRefs.current[3 + i] = el)}
                  className="digit-input"
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, "second", i)}
                  onKeyDown={(e) => handleKeyDown(e, "second", i)}
                />
              ))}

              <span className="hyphen">-</span>

              
              {fields.third.map((digit, i) => (
                <input
                  key={`third-${i}`}
                  ref={(el) => (inputRefs.current[8 + i] = el)}
                  className="digit-input"
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, "third", i)}
                  onKeyDown={(e) => handleKeyDown(e, "third", i)}
                />
              ))}
            </div>

            <button type="submit" className="btn-primary">
              Verify Cheque
            </button>
          </form>

         
          <div className="animation-container">
            {animationType === "success" && (
              <Lottie
                animationData={verifySuccess}
                loop={false}
                autoplay
                className="verify-lottie"
              />
            )}
            {animationType === "fail" && (
              <Lottie
                animationData={verifyFail}
                loop={false}
                autoplay
                className="verify-lottie"
              />
            )}
          </div>
        </div>

        
        <div className="glass-card instructions-card">
          <h4>Important Instructions</h4>
          <ul>
            <li>Ensure cheque number matches your physical cheque.</li>
            <li>Do not share cheque numbers publicly.</li>
            <li>Only numeric digits allowed after “BSF”.</li>
            <li>Verification fails for special characters or spaces.</li>
            <li>Contact BSF support for any assistance.</li>
          </ul>
        </div>

       
        <div className="glass-card footer-card">
          <p>
            For support: <b>0307-3377866</b> | Email:{" "}
            <b>support@blackstonefoods.com</b>
          </p>
          <p className="footer-note">
            © 2025 Black Stone Foods. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
