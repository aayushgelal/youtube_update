import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import  Navbar  from "./components/navbar";
import  "@fontsource/poppins";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Notifi",
  description: "Get Daily Newsletter from your Faviourite Youtube Creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "Poppins"}}
      >
              <script defer src="https://feedback-form-saas.vercel.app/embed.js" data-site-id="cm2kpb0y90001ksruqoxke023"></script>

            <Toaster position="top-right" reverseOrder={false} />

            <ClerkProvider>
            <Navbar />



        {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
