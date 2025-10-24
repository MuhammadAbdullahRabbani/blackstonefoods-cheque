import "../App.css";
import Lottie from "lottie-react";
import signupAnimation from "../assets/signup-animation.json";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    const { name, email, password } = data;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      
      await updateProfile(cred.user, { displayName: name });

      
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      toast.success(`Welcome ${name}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
      e.currentTarget.reset();
    }
  }

  function handleGuest() {
    toast("Continuing as Guest");
    navigate("/dashboard", { state: { guest: true } });
  }

  return (
    <div className="signup-wrap">
      <section className="hero">
        <h1 className="title">Create your account</h1>
        <p className="footer-note">
          By creating an account, you agree to our Terms and Privacy.
        </p>
      </section>

      <section>
        <form className="card-signup" onSubmit={handleSubmit}>
          <h3>Sign up</h3>

          <input
            className="input"
            type="text"
            name="name"
            placeholder="Full name"
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email address"
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            required
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

         
          <button
            type="button"
            className="btn-guest"
            onClick={handleGuest}
          >
            Continue as Guest
          </button>

          <div className="helper">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </form>
      </section>
      <Lottie
          animationData={signupAnimation}
          loop={true}
          autoplay={true}
          className="signup-lottie"
        />
    </div>
  );
}

export default Signup;
