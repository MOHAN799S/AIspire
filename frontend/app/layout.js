import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";




const inter = Inter({
  subsets: ["latin"]
});

export const metadata= {
  title: "AIspire",
  description: "Aspiring with the help of AI",
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
     appearance={{
      baseTheme: dark,
     }}
    >
      <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/*header */}
            <Header />
           <main className="min-h-screen">{children}</main>
           {/*footer */}
           <Footer />
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
