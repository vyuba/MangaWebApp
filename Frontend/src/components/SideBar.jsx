import { BookMarked, HistoryIcon, LucideHome } from "lucide-react";
import { useAppContext } from "../AppProvider";
import Tooltip from "./Tooltip";
import { Link } from "react-router";
function SideBar({ shrink }) {
  const Navlinks = [
    { name: "Dashboard", link: "/", icon: <LucideHome /> },
    { name: "Favourites", link: "/bookmark", icon: <BookMarked /> },
    { name: "Reading History", link: "/profile", icon: <HistoryIcon /> },
  ];

  const { sidebar } = useAppContext();

  return (
    <nav
      className={`bg-secondary border-border border transition-all  ${
        sidebar ? `hidden` : `flex`
      } ${
        shrink ? "md:w-[256px] transition-all" : "md:w-fit"
      } fixed md:static inset-0  md:flex  p-3 z-50 transition-all`}
    >
      <ul className="w-full flex flex-col gap-4 mt-20 md:mt-0">
        {Navlinks.map((nav, index) => (
          <Tooltip shrink={shrink} text={nav.name} key={index}>
            <Link
              to={nav.link}
              className={`p-3 flex flex-row items-center border-border bg-secondary ${
                shrink ? "w-full" : "md:w-[48px]"
              }  border gap-2`}
            >
              <span className="h-4 flex items-center justify-center">
                {nav.icon}
              </span>
              <span
                className={` pl-2 whitespace-nowrap overflow-hidden border-border ${
                  shrink ? "border-l-2" : "border-0"
                }`}
              >
                {nav.name}
              </span>
            </Link>
          </Tooltip>
        ))}
        <li></li>
      </ul>
    </nav>
  );
}

export default SideBar;
