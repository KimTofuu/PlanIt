import type { Metadata } from "next";
import { Poppins, Lato } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlanIt - Organize Your Work and Life",
  description: "Project management and task tracking made simple",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitializer = `
    (() => {
      try {
        const storageKey = "planit-theme";
        const stored = window.localStorage.getItem(storageKey);
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = stored === "light" || stored === "dark" ? stored : (prefersDark ? "dark" : "light");
        const root = document.documentElement;
        root.dataset.theme = theme;
        root.classList.toggle("dark", theme === "dark");
        root.style.colorScheme = theme;
        if (document.body) {
          document.body.dataset.theme = theme;
        }
      } catch (error) {
        console.error("Failed to initialize theme", error);
      }
    })();
  `;

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
        {/* Google Identity Services (OAuth for Calendar API) */}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body
        className={`${poppins.variable} ${lato.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
