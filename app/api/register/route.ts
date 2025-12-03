import { registerUser } from "@/auth/auth.controller";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const result = await registerUser(data);

    if ("error" in result) return new Response(JSON.stringify(result), { status: 400 });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? "Registration failed" }), { status: 500 });
  }
};
