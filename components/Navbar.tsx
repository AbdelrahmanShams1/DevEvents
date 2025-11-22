"use client";
import Link from "next/link";
import Image from "next/image";
import Logout from "./Logout";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  function handleLogin() {
    router.push("/login");
  }

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="#events">Events</Link>
          <Link href="/create">Create Event</Link>
          <button onClick={token ? handleLogout : handleLogin}>
            {" "}
            {token ? "Logout" : "Login"}
          </button>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
