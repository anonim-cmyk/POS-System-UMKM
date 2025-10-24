import { useState } from "react";
import restaurant from "../assets/images/room-restaurant.png";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
const Auth = () => {
  const [isRegistration, setIsRegistration] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* left section */}
      <div className="w-1/2 relative flex items-center justify-center bg-cover">
        <img
          src={restaurant}
          alt="room-restaurant"
          className="w-full h-full object-cover"
        />
        {/* black overlay */}
        <div className="absolute inset-0 bg-black opacity-80" />
        {/* Quote at bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl text-white font-poppins">
          "Serve customer the best food with prompt and friendly service in a
          welcoming atmosphere, and they'll keep coming back."
        </blockquote>
      </div>

      <div className="w-1/2 min-h-screen bg-[#1a1a1a] p-10">
        <div className="flex flex-col gap-2 items-center justify-center">
          <span>L O G O</span>
          <h1 className="font-bold text-4xl mt-10 text-yellow-400">
            {isRegistration ? "Employee Registration" : "Employee Login"}
          </h1>
          {/* Compononent */}
          {isRegistration ? (
            <Register setIsRegistration={setIsRegistration} />
          ) : (
            <Login />
          )}
          {/* <Register /> */}
          {/* <Login /> */}
          <div className="flex items-center justify-center mt-6">
            <p className="text-sm text-white font-poppins">
              {isRegistration
                ? "Already have an account?"
                : "Don't have an account?"}
              <a
                href="#"
                onClick={() => setIsRegistration(!isRegistration)}
                className="text-yellow-400 font-semibold font-poppins hover:underline"
              >
                {isRegistration ? "Sign In" : "Sign Up"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
