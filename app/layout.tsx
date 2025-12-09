import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essay Insight - AI-Powered Essay Analysis",
  description: "NLP-powered feedback tool for college application essays. Demonstrates tokenization, frequency analysis, regex patterns, n-grams, and Markov chains.",
  keywords: ["college essay", "NLP", "essay analysis", "writing feedback", "college application"],
  authors: [{ name: "Tim Nguyen" }],
  openGraph: {
    title: "Essay Insight",
    description: "AI-powered feedback for college application essays",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
