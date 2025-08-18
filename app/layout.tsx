import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const title = "RTL EPUB Maker";
const description = "Easily create EPUB e-book files with proper RTL support"
export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon-32x32.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        sizes: "16x16",
        url: "/favicon-16x16.png"
      }, {
        rel: "icon",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      }
    ]
  },
  openGraph: {
    title,
    description,
    images: "/android-chome-512x512.png",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
