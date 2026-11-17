import "./globals.css";

export const metadata = {
  title: "Review Sentiment Analyzer",
  description: "Paste a product review and see whether it is positive, negative or neutral, and why.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
