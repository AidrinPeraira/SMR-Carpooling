import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@smr/ui";
import "./globals.css";
import { QueryToastListener } from "@/components/QueryToastListener";
import QueryProvider from "@/components/Provider/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "ShareMyRide: Carpooling",
  description: "Portflio Project: Aidrin Peraira",
  icons: "/SMRIcon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full w-full bg-surface-primary">
        <QueryProvider>
          <ToastProvider>
            <QueryToastListener />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
