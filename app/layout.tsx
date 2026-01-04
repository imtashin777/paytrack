import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: "PayTrack - Invoice & Payment Tracker",
  description: "Simple invoice and payment tracker for freelancers",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Suppress Chrome extension errors before React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                
                // Suppress extension errors before React initializes
                const originalError = window.onerror;
                window.onerror = function(msg, url, line, col, error) {
                  const errorStr = String(msg || '');
                  const urlStr = String(url || '');
                  
                  // Check if error is from Chrome extension
                  if (
                    errorStr.includes('Minified React error #299') ||
                    errorStr.includes('embed script.js') ||
                    urlStr.includes('chrome-extension://') ||
                    urlStr.includes('moz-extension://') ||
                    urlStr.includes('embed_script.js')
                  ) {
                    console.warn('Suppressed extension error:', errorStr);
                    return true; // Prevent default error handling
                  }
                  
                  // Call original handler for real errors
                  if (originalError) {
                    return originalError.apply(this, arguments);
                  }
                  return false;
                };
                
                // Suppress unhandled promise rejections
                const originalUnhandled = window.onunhandledrejection;
                window.onunhandledrejection = function(event) {
                  const reason = String(event.reason || '');
                  
                  if (
                    reason.includes('embed script') ||
                    reason.includes('chrome-extension://') ||
                    reason.includes('React error #299')
                  ) {
                    console.warn('Suppressed extension rejection:', reason);
                    event.preventDefault();
                    return true;
                  }
                  
                  if (originalUnhandled) {
                    return originalUnhandled.apply(this, arguments);
                  }
                  return false;
                };
                
                // Catch errors at the earliest possible moment
                window.addEventListener('error', function(event) {
                  const msg = String(event.message || '');
                  const filename = String(event.filename || '');
                  
                  if (
                    msg.includes('Minified React error #299') ||
                    msg.includes('embed script') ||
                    filename.includes('chrome-extension://') ||
                    filename.includes('embed_script.js') ||
                    filename.includes('moz-extension://')
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                // Catch promise rejections
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = String(event.reason || '');
                  
                  if (
                    reason.includes('embed script') ||
                    reason.includes('chrome-extension://') ||
                    reason.includes('React error #299')
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
