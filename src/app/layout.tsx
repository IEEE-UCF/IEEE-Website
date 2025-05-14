import type { Metadata } from "next";
import "./globals.css";

// edit the seo...
// pls dont forget um
export const metadata: Metadata = {
  title: "IEEE UCF",
  description: "some mega good seo???? someone help idk what to put here",
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
