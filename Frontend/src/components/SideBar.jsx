import { BookMarked, DoorOpenIcon, LucideHome } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { supabase } from "../api/endpoint";
import Tooltip from "./Tooltip";
import { Link } from "react-router";
function SideBar({ shrink }) {
  const Navlinks = [
    { name: "Dashboard", link: "/dashboard", icon: <LucideHome /> },
    { name: "Favourites", link: "/dashboard/bookmark", icon: <BookMarked /> },
    // {
    //   name: "Reading History",
    //   link: "/dashboard/profile",
    //   icon: <HistoryIcon />,
    // },
  ];

  const { sidebar, session } = useAppContext();

  // console.log(session.user);
  return (
    <nav
      className={`bg-secondary border-border border    ${
        sidebar ? `hidden` : `flex`
      } ${
        shrink ? "md:w-auto transition-[width] duration-1000" : "md:w-fit "
      } fixed md:static inset-0  md:flex  p-3 z-50 transition-[width] duration-1000  flex-col justify-between`}
    >
      <ul className="w-full flex flex-col gap-4 mt-20 md:mt-0">
        {Navlinks.map((nav, index) => (
          <Tooltip shrink={shrink} text={nav.name} key={index}>
            <Link
              to={nav.link}
              className={`p-3 flex flex-row items-center border-border bg-secondary ${
                shrink ? "w-full" : "md:w-auto"
              }  border gap-2`}
            >
              <span className="h-4 flex items-center justify-center">
                {nav.icon}
              </span>
              <span
                className={` pl-2 whitespace-nowrap overflow-hidden border-border ${
                  shrink ? " hidden border-0 " : " border-l-2 block "
                }`}
              >
                {nav.name}
              </span>
            </Link>
          </Tooltip>
        ))}
      </ul>

      <ul className=" justify-self-end w-full flex flex-col gap-3">
        {session !== null ? (
          <>
            <li className="">{session?.user?.user_metadata?.first_name}</li>
            <li className="">{session?.user?.user_metadata?.email}</li>
            <li>
              <button
                className="flex capitalize items-center gap-2 border-border bg-accent border w-full p-3"
                onClick={async () => await supabase.auth.signOut()}
              >
                <DoorOpenIcon />
                <span
                  className={` pl-2 whitespace-nowrap overflow-hidden border-border ${
                    shrink ? " hidden border-0 " : " border-l-2 block "
                  }`}
                >
                  logout
                </span>
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/auth/login"
              className="flex capitalize items-center gap-2 border-border bg-accent border w-full p-3"
            >
              <DoorOpenIcon />
              <span
                className={` pl-2 whitespace-nowrap overflow-hidden border-border ${
                  shrink ? " hidden border-0 " : " border-l-2 block "
                }`}
              >
                login
              </span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default SideBar;
