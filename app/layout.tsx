import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chartik — Trading Quiz",
  description:
    "Test your knowledge of candlesticks, chart patterns, and market momentum with interactive multiple-choice quizzes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
