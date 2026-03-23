import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "FINDOOR | MIT ADT",
  description: "Smart Lost & Found Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* 1. AdSense Verification Meta Tag (Notice the closing slash at the end!) */}
        <meta name="google-adsense-account" content="ca-pub-7799320727690809" />
        
        {/* 2. AdSense Script Tag */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7799320727690809"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-[#030712] text-white font-sans min-h-screen antialiased selection:bg-blue-500/30">
        
        {/* NAVIGATION */}
        <header className="fixed top-0 w-full z-[100] border-b border-white/10 bg-[#030712] backdrop-blur-md">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                F
              </div>
              <span className="text-xl font-bold tracking-tighter text-white uppercase italic">
                FIN<span className="text-blue-500">DOOR</span>
              </span>
            </Link>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center gap-10 text-[12px] font-bold uppercase tracking-[0.2em]">
              <Link href="/" className="text-white hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/report-lost" className="text-white/70 hover:text-white transition-colors">
                Report Lost
              </Link>
              <Link href="/report-found" className="text-white/70 hover:text-white transition-colors">
                Report Found
              </Link>
              <Link href="/matches" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                Matches 
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              </Link>
              <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                About
              </Link>
            </div>

            {/* CAMPUS TAG */}
            <div className="hidden lg:block">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                MIT ADT University
              </span>
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="relative z-0 pt-24">
          {children}
        </main>

      </body>
    </html>
  );
}
