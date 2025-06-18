import Header from "@/app/_lib/Header";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
