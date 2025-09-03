import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBotWidget from "@/components/ui/ChatBotWidget";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChatMate ",
  description: "Chatt App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "dark",
        variables: {
          colorPrimary: "rgb(147, 51, 234)",
          colorTextOnPrimaryBackground: "white",
        },
      }}
      afterSignInUrl="/forums"
      afterSignUpUrl="/forums"
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedIn>
            <Navbar />
            <ChatBotWidget />
            <Footer />
          </SignedIn>
          
          {children}
          
        </body>
      </html>
    </ClerkProvider>
  );
}
