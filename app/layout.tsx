import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'; // or `v1X-appRouter` if you are using Next.js v1X
import "./globals.css";

export const metadata: Metadata = {
  title: "在线小工具集 | Un Jour",
  description: "无需登陆即可使用的在线小工具集，解决问题、提升效率的生活小帮手。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </body>
    </html>
  );
}
