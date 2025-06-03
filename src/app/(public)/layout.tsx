import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
} 