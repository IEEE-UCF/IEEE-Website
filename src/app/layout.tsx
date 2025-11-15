import type { Metadata } from "next";
import "./globals.css";

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
			<body>
				{children}
			</body>
		</html>
	);
}
