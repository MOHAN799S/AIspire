import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Chatbot from "@/components/Chat";
import { Toaster } from "sonner";
import { AuthListener } from "@/components/AuthListener";


// Load fonts with variables
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "AIspire",
  description: "Aspiring with the help of AI",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
      >
        <body className="antialiased font-sans">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Auth Status Listener for Toast Notifications */}
            <AuthListener />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#fff',
                },
                className: 'sonner-toast',
              }}
            />
            
            {/* Header */}
            <Header />
            
            {/* Chatbot */}
            <Chatbot />
            
            {/* Main Content */}
            <main className="min-h-screen">{children}</main>

            {/* Footer */}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}