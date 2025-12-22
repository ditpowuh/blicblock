import type {Metadata, Viewport} from "next";
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
