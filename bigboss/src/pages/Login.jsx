import "../App.css";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login-animation.json";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    const { email, password } = data;

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      toast.success(`Welcome back, ${user?.displayName || "User"}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
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
        <h1 className="title">Login to your account</h1>
        <p className="subtitle">Continue your journey with Black Stone Foods.</p>
      </section>

      <section>
        <form className="card-signup" onSubmit={handleSubmit}>
          <h3>Login</h3>

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
            {loading ? "Logging in..." : "Login"}
          </button>

          
          <button
            type="button"
            className="btn-guest"
            onClick={handleGuest}
          >
            Continue as Guest
          </button>

          <div className="helper">
            Don’t have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </section>
      <Lottie
          animationData={loginAnimation}
          loop={true}
          autoplay={true}
          className="login-lottie"
        />
    </div>
  );
}

export default Login;
