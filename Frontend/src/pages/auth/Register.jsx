import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "../../api/endpoint";
import { useAppContext } from "../../AppProvider";
import toast from "react-hot-toast";
function Register() {
  const [newSignUpDetails, setNewSignUpDetails] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { setSession } = useAppContext();
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await supabase.auth.signUp({
        email: newSignUpDetails.email,
        password: newSignUpDetails.password,
      });

      console.log(response);

      const { error: insertError } = await supabase.from("users").insert({
        foriegnKey: response?.user?.id,
        username: newSignUpDetails.username,
        email: response?.user?.email,
      });

      if (insertError) {
        console.error("Error storing data:", insertError);
        throw new Error("Error storing data", insertError.message);
      }

      toast.success("Login successful", {
        duration: 4000,
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
      throw new Error("error signing up", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSignUpDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  //   console.log(newSignUpDetails);

  const {
    data,
    error,
    failureReason,
    isError,
    isIdle,
    isPaused,
    isPending,
    isSuccess,
    mutateAsync: handleSignUpMutation,
  } = useMutation({
    mutationFn: handleSignUp,
    onSuccess: (data) => {
      console.log(data);
    },
  });
  console.log(data);
  return (
    <div className="w-full px-7">
      <img
        className="w-24 self-start px-1"
        src="../src/assets/MangaGeekLogo.svg"
        alt="mangaGeek logo"
      />
      <button className="capitalize border-l-[5px] border  border-accent p-3 gap-2 w-full flex items-center justify-center">
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
          type="text"
          className="w-full  border border-border bg-transparent p-3 focus:outline-accent "
          placeholder="@username"
          onChange={handleInputChange}
          name="username"
          value={newSignUpDetails.username}
        />
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
          {isPending ? "loading..." : "sign up"}
        </button>
        <p className="capitalize">
          already have an acccount already you can{" "}
          <NavLink className={`underline`} to={"/auth/login"}>
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
}

export default Register;
