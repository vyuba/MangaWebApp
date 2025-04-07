import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { SidebarClose } from "lucide-react";
// import { useAppContext } from "../AppProvider";

function DashboardLayout() {
  const [shrink, setShrink] = useState(true);

  //   const { session } = useAppContext();

  const handleSidebarShrink = () => {
    setShrink(!shrink);
  };
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     if (session === null) {
  //       navigate("/auth/login");
  //     }
  //   }, [session, navigate]);

  return (
    <div className="bg-background text-text w-screen h-screen md:flex md:flex-row relative">
      <Toaster />
      <div className="flex flex-row md:m-4 gap-2 transition-[width] duration-1000 w-auto">
        <SideBar shrink={shrink} />
        <button
          onClick={handleSidebarShrink}
          className="border-border  h-fit border bg-secondary p-2 z-30 hidden md:block"
        >
          <SidebarClose />
        </button>
      </div>
      <div
        id="content-container"
        className="px-4 py-4 flex flex-col gap-5 w-full h-full overflow-y-auto"
      >
        <Navbar />
        {/* <div className="py-16 md:py-0 w-full  h-fit " /> */}
        <ScrollToTop />
        <Outlet />
      </div>
      {/* <p>This is the Dashboard Layout</p> */}
    </div>
  );
}

export default DashboardLayout;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return null;
};
