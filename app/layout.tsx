import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morning Captain — Daily Briefing",
  description: "Your AI-powered daily command briefing. Chart your course through the noise.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <div className="stars" id="starfield" />
        <div className="grid-overlay" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_#0d1829_0%,_#050810_100%)] pointer-events-none z-0" />
        <div className="relative z-10 min-h-full flex flex-col">{children}</div>

        <Script id="starfield" strategy="afterInteractive">
          {`
            (function(){
              var container = document.getElementById('starfield');
              if(!container) return;
              var html = '';
              var layers = [
                { count: 60, minSize: 1, maxSize: 2, minDur: 3, maxDur: 7, opacity: 0.6 },
                { count: 30, minSize: 2, maxSize: 3, minDur: 5, maxDur: 10, opacity: 0.8 },
              ];
              layers.forEach(function(layer){
                for(var i=0; i<layer.count; i++){
                  var size = layer.minSize + Math.random()*(layer.maxSize-layer.minSize);
                  var x = Math.random()*100;
                  var y = Math.random()*100;
                  var dur = layer.minDur + Math.random()*(layer.maxDur-layer.minDur);
                  var delay = Math.random()*5;
                  html += '<div style="left:'+x+'%;top:'+y+'%;width:'+size+'px;height:'+size+'px;opacity:'+layer.opacity+';--duration:'+dur+'s;--delay:'+delay+'s"></div>';
                }
              });
              container.innerHTML = html;
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
