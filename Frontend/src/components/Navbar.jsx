import { Menu, X } from "lucide-react";
import Logo from "../assets/MangaGeekLogo.svg";
import { useAppContext } from "../AppProvider";
import SearchInput from "./SearchInput";
import { Link } from "react-router";
function Navbar() {
  const { sidebar, setSidebar } = useAppContext();
  const handleClick = () => {
    setSidebar(!sidebar);
  };

  return (
    <div className="w-full fixed md:relative top-0 left-0 z-[50] ">
      <div className="bg-background md:bg-transparent relative  flex flex-col gap-4 w-full p-4">
        <nav className="w-full  flex items-center justify-between py-2 z-[60] md:hidden">
          <Link to="/">
            <img src={Logo} alt="MangaGeek Logo" />
          </Link>
          <button
            onClick={handleClick}
            className="border-border bg-secondary border p-2 "
          >
            {sidebar ? <Menu /> : <X />}
          </button>
        </nav>
        <div className="w-full flex justify-center">
          <SearchInput />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
