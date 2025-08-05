import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import parseHtml, { HTMLReactParserOptions } from "html-react-parser";
import * as cheerio from "cheerio";
import { sanitizeHead, sanitizeBody } from "@/helpers/sanitize";
import { replaceBody } from "@/helpers/replace-body";
import { twMerge } from "tailwind-merge";
import Script from "next/script";
// import { useWebflowReInit } from "@/lib/use-webflow-reinit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await fetch(process.env.WEBFLOW_URL!, { cache: "force-cache" });
  if (!res.ok) throw new Error("Webflow page not found");

  const $ = cheerio.load(await res.text());

  const headHtml = sanitizeHead($("head").html() ?? "");
  const bodyHtml = sanitizeBody($("body").html() ?? "");
  const bodyClasses = $("body").attr("class") ?? "";
  const htmlClasses = $("html").attr("class") ?? "";

  const headOpts: HTMLReactParserOptions = {
    replace: (node) =>
      node.type === "text" && /^\s*$/.test((node as any).data ?? "")
        ? null
        : undefined,
  };

  /* --- replace nodes (banana-quiz button, images, …) ---------------- */
  const bodyOpts: HTMLReactParserOptions = { replace: replaceBody };

  const externalScripts: string[] = [];
  const inlineJSON: { id: string; html: string }[] = [];

  $("script").each((_, el) => {
    const $el = $(el);
    const src = $el.attr("src");

    if (src) {
      // include only Webflow’s own assets
      if (/webflow|jquery/i.test(src)) externalScripts.push(src);
    } else if (
      $el.attr("type") === "application/json" &&
      $el.attr("data-wf-page")
    ) {
      inlineJSON.push({
        id: $el.attr("data-wf-page")!, // stable unique id
        html: $el.html() ?? "",
      });
    }
  });

  return (
    <html className={htmlClasses} lang="en">
      <head>
        {/*<Script*/}
        {/*  src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"*/}
        {/*  strategy="afterInteractive"*/}
        {/*/>*/}
        {parseHtml(headHtml, headOpts)}
      </head>
      <body
        className={twMerge(
          `${geistSans.variable} ${geistMono.variable} antialiased size-full`,
          bodyClasses
        )}
      >
        {parseHtml(bodyHtml, bodyOpts)}
        {children}
        {externalScripts.map((src) => (
          <Script key={src} src={src} strategy="afterInteractive" />
        ))}

        {/* /!* --- inject the interactions JSON so webflow.js can read it --- *!/ */}
        {inlineJSON.map(({ id, html }) => (
          <Script
            key={id}
            id={`ix-json-${id}`}
            type="application/json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </body>
    </html>
  );
}
