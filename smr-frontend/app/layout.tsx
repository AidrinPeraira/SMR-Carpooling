import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@sharemyride/ui";
import "./globals.css";
import { QueryToastListener } from "@/components/QueryToastListener";
import QueryProvider from "@/components/Provider/QueryProvider";
import { ReactNode } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapProvider } from "@/features/map/context/MapProvider";
import { VoiceCallProvider } from "@/features/voice-call/context/VoiceCallContext";
import { CallModals } from "@/features/voice-call/components/CallModals";

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

//set up map boxkkkkkkkkk

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="dark min-h-full w-full bg-surface-primary">
        <QueryProvider>
          <ToastProvider>
            <MapProvider>
              <VoiceCallProvider>
                <QueryToastListener />
                {children}
                {modal}
                <CallModals />
              </VoiceCallProvider>
            </MapProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
