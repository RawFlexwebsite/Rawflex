import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import Script from "next/script";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--bricolage",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gulshan Modest | Modest Fashion, Quietly Elevated",
  description:
    "Gulshan Modest crafts abayas, hijabs and modest essentials with botanical detailing, premium fabric and timeless silhouettes. Shop the new collection online, across Delhi NCR and pan-India.",
  keywords: [
    "Gulshan Modest",
    "modest fashion",
    "abaya",
    "hijab",
    "modest wear India",
  ],
  icons: {
    icon: '/logo-dark.webp',
    apple: '/logo-dark.webp',
  },
  openGraph: {
    title: "Gulshan Modest | Modest Fashion, Quietly Elevated",
    description:
      "Abayas, hijabs and modest essentials crafted with botanical detailing and premium fabric.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
      <head>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1052580883980327');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="font-body bg-cream text-ink antialiased">
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1052580883980327&ev=PageView&noscript=1"
            alt="facebook pixel noscript"
          />
        </noscript>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
