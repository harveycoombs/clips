import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Footer from "@/app/components/footer";

const inter = Inter({
    weight: ["400", "500", "600", "700", "900"],
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "Clips · Harvey Coombs",
    description: "A video editing & sharing service."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`h-screen ${inter.className} bg-white text-slate-800 dark:bg-slate-800 dark:text-white`}>
                {children}
                <Footer />
            </body>
        </html>
    );
}