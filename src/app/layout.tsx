import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata = {
  title: "UX Educational Platform",
  description: "Platform for UX and pedagogical design patterns in EVAs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
