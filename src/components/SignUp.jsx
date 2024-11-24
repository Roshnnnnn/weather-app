import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfrmPass, setCnfrmPass] = useState("");
  const [isSpecialMember, setIsSpecialMember] = useState(false);
  const [passToggle, setPassToggle] = useState(false);
  const [cnfrmPassToggle, setCnfrmPassToggle] = useState(false);

  const navigate = useNavigate();

  const registerUser = (e) => {
    e.preventDefault();
    if (password !== cnfrmPass) {
      toast.error("Password not matched");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);

        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          isSpecialMember: isSpecialMember,
        });

        toast.success("Sign up complete");
        navigate("/signin");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const togglePassword = () => {
    setPassToggle(!passToggle);
  };

  const cnfrmTogglePassword = () => {
    setCnfrmPassToggle(!cnfrmPassToggle);
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div
          className="bg-cover bg-center h-screen flex justify-center items-center"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.3)", // bg-slate-800 with opacity
              border: "1px solid #4B5563", // border-slate-400
              borderRadius: "0.375rem", // rounded-md
              padding: "2rem", // p-8
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-lg
              backdropFilter: "blur(10px)", // backdrop-filter
              position: "relative",
            }}
          >
            <h1
              style={{
                fontSize: "2.25rem", // text-4xl
                fontWeight: "bold",
                color: "white",
                marginBottom: "1.5rem", // mb-6
                textAlign: "center",
              }}
            >
              Sign Up
            </h1>
            <form
              action=""
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={registerUser}
            >
              <div style={{ margin: "1rem 0", position: "relative" }}>
                <input
                  type="text"
                  style={{
                    display: "block",
                    width: "18rem", // w-72
                    padding: "0.5rem 0", // py-2.3
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "2px solid #D1D5DB", // border-gray-300
                    appearance: "none",
                  }}
                  placeholder=""
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label
                  style={{
                    position: "absolute",
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    transition: "transform 0.3s, color 0.3s",
                    transform: "translateY(-1.5rem) scale(0.75)",
                    top: "0.75rem",
                    left: "0",
                  }}
                >
                  Username
                </label>
                <BiUser
                  style={{ position: "absolute", top: "0", right: "1rem" }}
                />
              </div>
              <div style={{ margin: "1rem 0", position: "relative" }}>
                <input
                  type="email"
                  style={{
                    display: "block",
                    width: "18rem", // w-72
                    padding: "0.5rem 0", // py-2.3
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "2px solid #D1D5DB", // border-gray-300
                    appearance: "none",
                  }}
                  placeholder=""
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  style={{
                    position: "absolute",
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    transition: "transform 0.3s, color 0.3s",
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
                  type={passToggle ? "text" : "password"}
                  style={{
                    display: "block",
                    width: "18rem", // w-72
                    padding: "0.5rem 0", // py-2.3
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "2px solid #D1D5DB", // border-gray-300
                    appearance: "none",
                  }}
                  placeholder=""
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  style={{
                    position: "absolute",
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    transition: "transform 0.3s, color 0.3s",
                    transform: "translateY(-1.5rem) scale(0.75)",
                    top: "0.75rem",
                    left: "0",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={togglePassword}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "1rem",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {passToggle ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              <div style={{ margin: "1rem 0", position: "relative" }}>
                <input
                  type={cnfrmPassToggle ? "text" : "password"}
                  style={{
                    display: "block",
                    width: "18rem", // w-72
                    padding: "0.5rem 0", // py-2.3
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "2px solid #D1D5DB", // border-gray-300
                    appearance: "none",
                  }}
                  placeholder=""
                  required
                  value={cnfrmPass}
                  onChange={(e) => setCnfrmPass(e.target.value)}
                />
                <label
                  style={{
                    position: "absolute",
                    fontSize: "0.875rem", // text-sm
                    color: "white",
                    transition: "transform 0.3s, color 0.3s",
                    transform: "translateY(-1.5rem) scale(0.75)",
                    top: "0.75rem",
                    left: "0",
                  }}
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={cnfrmTogglePassword}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "1rem",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {cnfrmPassToggle ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              <div style={{ margin: "1rem 0", position: "relative" }}>
                <input
                  type="checkbox"
                  id="specialMember"
                  checked={isSpecialMember}
                  onChange={(e) => setIsSpecialMember(e.target.checked)}
                />
                <label
                  htmlFor="specialMember"
                  style={{ color: "white", marginLeft: "0.5rem" }}
                >
                  Special Member
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ margin: "1rem" }}>
                  Already Member?
                  <Link to="/signin" style={{ color: "#007bff" }}>
                    Sign In
                  </Link>
                </span>
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  margin: "1rem 0",
                  padding: "0.75rem 0",
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#28a745",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
