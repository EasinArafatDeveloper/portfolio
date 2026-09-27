import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { profile } from "@/data/profile";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Variable width + figure height axes let the clock be tall and condensed like iOS 26.
const clock = Roboto_Flex({ variable: "--font-clock", subsets: ["latin"], axes: ["wdth", "YTFI", "opsz"] });
const display = Inter_Tight({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.tagline,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f7" },
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
  ],
};

// Sets the theme before paint so there is no light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t||t==='system'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t;if(localStorage.getItem('tint')==='true')document.documentElement.dataset.tint='true'}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable} ${clock.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
