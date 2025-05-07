import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./../globals.css";
import AddinNav from "./addin-nav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:9000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Integrated",
  description: "",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="h-screen w-full flex flex-col px-4 py-2 overflow-auto">
            <AddinNav />
            <div className="flex-1 flex flex-col items-center justify-center">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
