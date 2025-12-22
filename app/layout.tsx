import type {Metadata, Viewport} from "next";
import {connection} from "next/server";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

interface RootLayoutProps {
  children?: React.ReactNode;
}

export default async function RootLayout({children}: RootLayoutProps) {
  await connection();

  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
