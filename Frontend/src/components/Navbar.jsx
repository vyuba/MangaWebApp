import { Menu, X } from "lucide-react";
import Logo from "../assets/MangaGeekLogo.svg";
import { useAppContext } from "../AppProvider";
function Navbar() {
  const { sidebar, setSidebar } = useAppContext();
  const handleClick = () => {
    setSidebar(!sidebar);
  };
  return (
    <nav className="w-full flex items-center justify-between py-2 z-[60] md:hidden">
      <img src={Logo} alt="MangaGeek Logo" />
      <button
        onClick={handleClick}
        className="border-border bg-secondary border p-2 "
      >
        {sidebar ? <Menu /> : <X />}
      </button>
    </nav>
  );
}

export default Navbar;
