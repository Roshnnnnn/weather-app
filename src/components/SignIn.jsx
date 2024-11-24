import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { setActiveUser } from "../redux/slices/authSlice";
import { setActiveUser } from "../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const signinUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch(
          setActiveUser({
            email: user.email,
            userId: user.uid,
            isSpecialMember: userData.isSpecialMember ?? false,
          })
        );
      } else {
        dispatch(
          setActiveUser({
            email: user.email,
            userId: user.uid,
            isSpecialMember: false,
          })
        );
      }
      toast.success("Welcome! Login Successful");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setLoading(true);

    try {
      const guestEmail = "user@user.com";
      const guestPassword = "1234567890";
      const response = await signInWithEmailAndPassword(
        auth,
        guestEmail,
        guestPassword
      );
      const user = response.user;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch(
            setActiveUser({
              email: user.email,
              userId: user.uid,
              isSpecialMember: userData.isSpecialMember ?? false,
            })
          );
        } else {
          dispatch(
            setActiveUser({
              email: user.email,
              userId: user.uid,
              isSpecialMember: false,
            })
          );
        }
        toast.success("Welcome! Guest Login Successful");
        navigate("/");
      } else {
        console.log("User object is null");
      }
    } catch (error) {
      console.error("Guest login error:", error);
      toast.error("An error occurred during guest login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)", // bg-slate-800
              border: "1px solid rgba(156, 163, 175, 1)", // border-slate-400
              borderRadius: "0.375rem", // rounded-md
              padding: "2rem", // p-8
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)", // shadow-lg
              backdropFilter: "blur(10px)", // backdrop-filter
              position: "relative",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.25rem", // text-4xl
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "1.5rem", // mb-6
                  textAlign: "center",
                }}
              >
                Login
              </h1>
              <form
                action=""
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={signinUser}
              >
                <div style={{ margin: "1rem 0", position: "relative" }}>
                  <input
                    type="email"
                    required
                    style={{
                      width: "18rem", // w-72
                      padding: "0.625rem 0", // py-2.3
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      borderBottom: "2px solid rgba(156, 163, 175, 1)", // border-gray-300
                      outline: "none",
                    }}
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    style={{
                      position: "absolute",
                      color: "white",
                      transition: "0.3s",
                      transform: "translateY(-1.5rem) scale(0.75)",
                      top: "0.75rem",
                      left: "0",
                    }}
                  >
                    Your Email
                  </label>
                  <BiUser
                    style={{ position: "absolute", top: "0", right: "1rem" }}
                  />
                </div>
                <div style={{ margin: "1rem 0", position: "relative" }}>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder=""
                    required
                    style={{
                      width: "18rem", // w-72
                      padding: "0.625rem 0", // py-2.3
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      borderBottom: "2px solid rgba(156, 163, 175, 1)", // border-gray-300
                      outline: "none",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    style={{
                      position: "absolute",
                      color: "white",
                      transition: "0.3s",
                      transform: "translateY(-1.5rem) scale(0.75)",
                      top: "0.75rem",
                      left: "0",
                    }}
                  >
                    Your Password
                  </label>
                  {passwordVisible ? (
                    <AiOutlineEye
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" style={{ marginRight: "0.5rem" }} />
                    <label htmlFor="Remember Me">Remember me</label>
                  </div>
                  <Link to="/reset" style={{ color: "#3b82f6" }}>
                    {" "}
                   
                    Forgot Password
                  </Link>
                </div> */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginBottom: "1rem", // mb-4
                    marginTop: "1.5rem", // mt-6
                    borderRadius: "9999px", // rounded-full
                    backgroundColor: "white",
                    color: "#16a34a", // text-emerald-800
                    padding: "0.5rem",
                    transition: "background-color 0.3s",
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={guestLogin}
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginBottom: "1rem", // mb-4
                    marginTop: "1.5rem", // mt-6
                    borderRadius: "9999px", // rounded-full
                    backgroundColor: "white",
                    color: "#16a34a", // text-emerald-800
                    padding: "0.5rem",
                    transition: "background-color 0.3s",
                  }}
                >
                  {loading ? "Logging in..." : "Guest Login"}
                </button>
                <div>
                  <span style={{ margin: "1rem" }}>
                    New Here?
                    <Link to="/signup" style={{ color: "#3b82f6" }}>
                      {" "}
                      {/* text-blue-600 */}
                      SignUp
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
