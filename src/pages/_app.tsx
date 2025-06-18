import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="w-full flex flex-col items-center justify-center py-8 bg-white shadow-sm mb-8">
        <img src="/images.png" alt="Fillout Logo" className="w-60 h-20 mb-3 shadow" />
      </header>
      <main className="max-w-4xl mx-auto px-4">
        <Component {...pageProps} />
      </main>
    </>
  );
}
