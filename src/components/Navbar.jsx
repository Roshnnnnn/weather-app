import { FaRegUserCircle } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    console.log("click");
    setDropdownVisible(!dropdownVisible);
  };

  const handleSignIn = (event) => {
    event.stopPropagation();
    console.log("Sign In clicked");
  };

  const handleSignOut = (event) => {
    event.stopPropagation();
    console.log("Sign Out clicked");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <div></div>
      <div>
        <FaRegUserCircle
          onClick={toggleDropdown}
          style={{ fontSize: "2rem", marginRight: "1rem" }}
        />
        {dropdownVisible && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              zIndex: 1000,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ padding: "0.5rem" }} onClick={handleSignIn}>
              Sign In
            </div>
            <div style={{ padding: "0.5rem" }} onClick={handleSignOut}>
              Sign Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
