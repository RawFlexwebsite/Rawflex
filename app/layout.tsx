import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Permanent_Marker } from "next/font/google";
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

const marker = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-marker",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAWFLEX | Streetwear, Built Different",
  description:
    "RAWFLEX crafts oversized tees, acid wash fits, gym wear and limited edition drops from Kanpur, India. Heavyweight fabric, one-of-one finishes, shipped pan-India.",
  keywords: [
    "RAWFLEX",
    "streetwear",
    "oversized tees",
    "acid wash",
    "gym collection",
    "men's clothing India",
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', url: '/favicon-48x48.png' },
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  openGraph: {
    title: "RAWFLEX | Streetwear, Built Different",
    description:
      "Oversized tees, acid wash fits and limited edition drops. Heavyweight fabric, one-of-one finishes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable} ${marker.variable}`}>
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
      <body className="font-body bg-cream text-ink antialiased" suppressHydrationWarning>
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
