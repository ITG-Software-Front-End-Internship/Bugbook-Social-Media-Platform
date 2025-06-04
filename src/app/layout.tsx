import { getLocaleSettings } from "@/hooks/useLocaleSettings";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Cairo, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "Bugbook social media platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, direction } = await getLocaleSettings();

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} font-cairo antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
