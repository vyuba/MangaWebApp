import { Menu, Search, X } from "lucide-react";
import Logo from "../assets/MangaGeekLogo.svg";
import { useAppContext } from "../AppProvider";
import SearchInput from "./SearchInput";
import { Link } from "react-router";
import { useState } from "react";
import { useLocation } from "react-router";
function Navbar() {
  const { sidebar, setSidebar } = useAppContext();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const handleClick = () => {
    setSidebar(!sidebar);
  };

  const location = useLocation();

  return (
    <div className="w-full fixed md:relative top-0 left-0 z-[50] ">
      <div className="bg-background md:bg-transparent relative  flex flex-col gap-4 w-full p-4">
        <nav className="w-full  flex items-center justify-between py-2 z-[60] md:hidden">
          <Link to="/dashboard">
            <img src={Logo} alt="MangaGeek Logo" />
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="border-border bg-secondary border p-2 "
            >
              {!showSearchBar ? <Search /> : <X />}
            </button>
            <button
              onClick={handleClick}
              className="border-border bg-secondary border p-2 "
            >
              {sidebar ? <Menu /> : <X />}
            </button>
          </div>
        </nav>
        <div className="w-full flex justify-center gap-4">
          {location.pathname !== "/dashboard/search" && (
            <div
              className={`fixed md:static w-full px-6 md:px-4 top-[20%] left-1/2 md:top-0 md:left-0 -translate-x-1/2  md:-translate-x-0 md:-translate-y-0 -translate-y-1/2 items-center justify-center ${
                !showSearchBar ? "hidden md:flex" : "flex"
              }`}
            >
              <SearchInput />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
