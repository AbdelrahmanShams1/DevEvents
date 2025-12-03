"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Logout = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []); // FIXED

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  function handleLogin() {
    router.push("/login");
  }
  console.log("Token in Logout component:", token);

  return (
    <>
      <button onClick={token ? handleLogout : handleLogin}>
        {" "}
        {token ? "Logout" : "Login"}{" "}
      </button>
    </>
  );
};

export default Logout;
