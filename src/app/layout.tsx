import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import parseHtml, { HTMLReactParserOptions } from "html-react-parser";
import * as cheerio from "cheerio";
import { sanitizeHead, sanitizeBody } from "@/helpers/sanitize";
import { replaceBody } from "@/helpers/replace-body";
import { twMerge } from "tailwind-merge";
import Script from "next/script";
import WebflowInit from "@/components/WebflowInit";
import { getHtmlDataAttrs } from "@/helpers/getHtmlDataAttrs";
import { Fragment } from "react";

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
  const htmlDataAttrs = getHtmlDataAttrs($);

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
    <html
      {...htmlDataAttrs}
      suppressHydrationWarning
      className={twMerge(
        htmlDataAttrs.class ?? "", // keep original classes
        `${geistSans.variable} ${geistMono.variable}`,
      )}
      lang="en"
    >
      <head>
        {/*<Script*/}
        {/*  src="https://ai-chatbot-pearl-kappa.vercel.app/api/pictocard/widget.js"*/}
        {/*  strategy="afterInteractive"*/}
        {/*/>*/}
        {parseHtml(headHtml, headOpts)}
      </head>
      <body
        className={twMerge(
          `${geistSans.variable} ${geistMono.variable} antialiased size-full`,
          bodyClasses,
        )}
      >
        {parseHtml(bodyHtml, bodyOpts)}
        {children}

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

        {externalScripts.map((src) => {
          const isWebflow = /webflow/i.test(src);
          return (
            <Fragment key={src}>
              <link
                rel="preload"
                href={src}
                as="script"
                crossOrigin=""
                fetchPriority="high"
              />
              <Script
                src={src}
                strategy={isWebflow ? "afterInteractive" : "beforeInteractive"}
              />
            </Fragment>
          );
        })}

        <WebflowInit />
      </body>
    </html>
  );
}
