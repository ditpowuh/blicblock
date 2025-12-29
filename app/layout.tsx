import type {Metadata, Viewport} from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png"
  },
  description: "Play a recreation of Blicblock from The Sims 4 in your browser."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

interface RootLayoutProps {
  children?: React.ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
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
