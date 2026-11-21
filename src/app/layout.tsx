import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IziAnalytics — L'Analytics épuré pour Fondateurs de SaaS",
  description: "Suivez vos visiteurs, vos sources TikTok/Reels et vos revenus en temps réel sans ralentir votre site.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-slate-100 antialiased selection:bg-brand-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
