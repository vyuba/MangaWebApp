import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="bg-background text-text w-screen h-screen flex ">
      <div className="flex-1 flex items-center justify-center h-full">
        <Outlet />
      </div>
      <div className="flex-1 bg-accent  hidden md:block">AuthLayout</div>
    </div>
  );
}

export default AuthLayout;
