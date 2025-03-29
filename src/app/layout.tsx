import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google"
import ReactQueryProvider from "./contexts/ReactQueryProvider";
import Header from "./components/Header";

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
        <ReactQueryProvider>
          <Header />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
