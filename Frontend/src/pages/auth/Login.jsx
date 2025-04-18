import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router";
import { supabase } from "../../api/endpoint";
import { NavLink } from "react-router";
function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [newSignUpDetails, setNewSignUpDetails] = useState({
    email: "",
    password: "",
  });

  const { setSession } = useAppContext();

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await supabase.auth.signInWithPassword(newSignUpDetails);

      if (response.error) {
        // console.log(response);
        throw new Error(response.error);
      }

      toast.success("Login successful", {
        position: "top-right",
        icon: <CheckCircle2 className="text-accent" />,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/dashboard");

      setSession(response);

      return response;
    } catch (error) {
      toast.error(error?.message, {
        position: "top-right",
        icon: <X />,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "red",
        },
      });
      console.error(error?.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSignUpDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // console.log(newSignUpDetails);

  const { isPending, mutateAsync: handleSignUpMutation } = useMutation({
    mutationFn: handleSignUp,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // useEffect(() => {
  //   if (isPending) {
  //     toast.loading("Loading...", {
  //       position: "top-right",
  //       icon: <CheckCircle2 className="text-accent" />,
  //       style: {
  //         borderRadius: "10px",
  //         background: "#333",
  //         color: "#fff",
  //       },
  //     });
  //   }
  // }, [isPending]);

  // console.log(data);

  const handleGoogleLogin = async (e) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${apiUrl}/dashboard`,
        },
      });

      if (error) {
        console.error("OAuth sign-in error:", error);
        throw new Error(error);
      }

      // You usually don’t need to do anything else here — Supabase redirects the user.

      console.log(data);

      setSession(data);
    } catch (err) {
      toast.error(`Unexpected error: ${err.message || err}`);
      console.error("Unexpected error during OAuth:", err);
    }
  };
  return (
    <div className="w-full px-7">
      <img
        className="w-24 self-start px-1"
        src="../src/assets/MangaGeekLogo.svg"
        alt="mangaGeek logo"
      />
      <button
        className="capitalize border-l-[5px] border  border-accent p-3 gap-2 w-full flex items-center justify-center"
        onClick={(e) => handleGoogleLogin(e)}
      >
        <div className="w-6 h-6">
          <svg
            className="fill-border stroke-accent w-full"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 50 50"
          >
            <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
          </svg>
        </div>
        <p>login with google</p>
      </button>
      <div className="text-border flex items-center justify-center w-full gap-2">
        <div className="h-[1px] w-[30%] bg-border"></div>
        <p>or</p>
        <div className="h-[1px] w-[30%] bg-border"></div>
      </div>
      <form className="w-full flex flex-col gap-4">
        <input
          type="email"
          className="w-full border border-border bg-transparent p-3 focus:outline-accent "
          placeholder="@email"
          onChange={handleInputChange}
          name="email"
          value={newSignUpDetails.email}
        />
        <input
          type="password"
          className="w-full border border-border bg-transparent p-3 focus:outline-accent "
          placeholder="@password"
          onChange={handleInputChange}
          name="password"
          value={newSignUpDetails.password}
        />
        <button
          onClick={handleSignUpMutation}
          className="bg-accent border-border border capitalize p-3 w-full"
        >
          {isPending ? "loading..." : "Login"}
        </button>
        <p className="capitalize">
          dont you have an acccount already you can ?{" "}
          <NavLink className={`underline`} to={"/auth/register"}>
            sign up
          </NavLink>
        </p>
      </form>
    </div>
  );
}

export default Login;
