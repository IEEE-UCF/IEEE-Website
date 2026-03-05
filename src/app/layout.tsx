import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

// edit the seo...
// pls dont forget um
export const metadata: Metadata = {
	title: "IEEE UCF Student Chapter",
	description: "IEEE UCF is the largest electrical engineering organization at UCF. We host EE and CS projects, workshops, and professional events.",
	icons: {
		icon: '/iconography/ieeeucficon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/wasm/openjpeg_nowasm_fallback.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/web/pdf_viewer.min.css"></link>
      </head>
      <body>
         <Providers>{children}</Providers>
      </body>
    </html>
  );
}