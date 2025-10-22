"use client";
import Image from "next/image";
import React from "react";

const Login = () => {

  return (
    <main className="w-full min-h-screen relative overflow-hidden p-4 flex flex-col items-center justify-between">
      {/* Hero Image */}
      <div className="w-full lg:max-w-md mx-auto flex items-center justify-center mt-8 lg:mt-2">
        <Image
          src="/assets/login.png"
          alt="Login Main Image"
          width={500}
          height={500}
          className="max-w-full h-auto"
        />
      </div>

      {/* Logo + Intro Text */}
      <div className="flex flex-col items-center gap-3 text-center mt-4">
        <Image src="/assets/logo.svg" alt="Logo" width={120} height={120} />
        <p className="text-base text-foreground max-w-sm">
          Create, fund, and verify <span className="text-primary font-medium">social impact events</span> with HuddleUp Protocol.  
          Sponsors, organizers, and participants — all in one app.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm my-8">
        <button className="w-full border border-black rounded-xl flex items-center justify-center gap-3 p-4 text-center text-black font-medium bg-white transition-all duration-200 hover:bg-black hover:text-white active:scale-95">
          <Image
            src="/assets/icons/apple.svg"
            alt="Apple Logo"
            width={20}
            height={20}
            className="transition-transform duration-200 group-hover:scale-110"
          />
          Continue with Apple
        </button>

        <button className="w-full border border-black rounded-xl flex items-center justify-center gap-3 p-4 text-center text-black font-medium bg-white transition-all duration-200 hover:bg-primary hover:text-white active:scale-95">
          <Image
            src="/assets/icons/google.svg"
            alt="Google Logo"
            width={20}
            height={20}
            className="transition-transform duration-200 group-hover:scale-110"
          />
          Continue with Google
        </button>

      </div>

      {/* Footer */}
      <p className="text-sm text-foreground text-center mb-4 max-w-md">
        By signing in, you agree to the{" "}
        <span className="text-primary cursor-pointer hover:underline">
          User Agreement
        </span>{" "}
        and{" "}
        <span className="text-primary cursor-pointer hover:underline">
          Privacy Policy
        </span>{" "}
        of HuddleUp Protocol — empowering transparency in social impact.
      </p>
    </main>
  );
};

export default Login;
