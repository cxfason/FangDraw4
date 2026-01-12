import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI你画我猜",
  description: "和AI一起玩你画我猜游戏",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
