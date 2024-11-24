import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <div>
        {/* <Navbar /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default App;
