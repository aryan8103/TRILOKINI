import type { Metadata } from "next";
import { Crimson_Text, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Trilokini",
  description: "Contemporary Indian fashion and occasionwear.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${crimsonText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-center" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
