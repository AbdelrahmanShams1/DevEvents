import ReactQueryProvider from "@/lib/reactQuery/providers";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </>
  );
}
