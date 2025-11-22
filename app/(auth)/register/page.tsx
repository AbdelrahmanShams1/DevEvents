"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type RegisterInput = { name: string; email: string; password: string };

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterInput>();

  const onSubmit = async (data: RegisterInput) => {
    console.log("Register form submitted", data);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("SERVER RESPONSE:", result);

      if (!res.ok) {
        alert(result.error);
        return;
      }

      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Name" />
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} placeholder="Password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
