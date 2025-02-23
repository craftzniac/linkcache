import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google"

const font = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
})


export const metadata: Metadata = {
  title: "Linkcache",
  description: "save links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`h-dvh w-dvw text-blue-950 flex flex-col ${font.className}`}
      >
        <header className="font-bold flex w-full p-2 font-lg text-start">Linkcache</header>
        {children}
      </body>
    </html>
  );
}
