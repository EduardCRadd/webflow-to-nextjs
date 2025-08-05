import xss, { escapeAttrValue } from "xss";

const COMMON = [
  "class",
  "style",
  "id",
  "data-w-id",
  "data-wf-page-id",
  "data-wf-element-id",
  "role",
  "words-slide-up",
  "text-split",
  "sizes",
  "srcset",
  "scrub-each-word",

  "data-collapse",
  "data-animation",
  "data-duration",
  "fs-scrolldisable-element",
  "data-easing",
  "data-easing2",
  "aria-current",
  "data-name",
  "data-wait",
  "aria-current",
];

export const sanitizeHead = (html: string) =>
  xss(html, {
    whiteList: {
      link: [
        "rel",
        "href",
        "type",
        "media",
        "sizes",
        "crossorigin",
        "as",
        "precedence",
        "id",
      ],
      style: [], // allow <style>
      meta: ["name", "content", "property", "charset", "id"],
      title: ["id"],
      // keep Webflow loaders; remove this block if preferred to strip scripts
      script: ["src", "type", "async", "defer", "id"],
      // script: [],
    },
    css: false,
    // stripIgnoreTag: true,
    // stripIgnoreTagBody: ["script"],
  });

export const sanitizeBody = (html: string) =>
  xss(html, {
    whiteList: {
      div: [...COMMON, "data-feature-card-grid", "data-larc-scene"],
      span: COMMON,
      section: COMMON,
      p: COMMON,
      br: COMMON,
      h1: COMMON,
      h2: COMMON,
      h3: COMMON,
      h4: COMMON,
      h5: COMMON,
      h6: COMMON,
      strong: COMMON,
      nav: COMMON,
      img: [...COMMON, "src", "width", "height", "alt", "loading"],
      a: [...COMMON, "href", "target", "rel", "data-button-value"],
      button: [...COMMON, "data-button-value"],
      form: [
        ...COMMON,
        "name",
        "action",
        "method",
        "autocomplete",
        "novalidate",
      ],
      input: [
        ...COMMON,
        "type",
        "name",
        "value",
        "placeholder",
        "autocomplete",
        "required",
        "maxlength",
      ],
      link: [
        "rel",
        "href",
        "type",
        "media",
        "sizes",
        "crossorigin",
        "as",
        "precedence",
        "id",
      ],
    },
    css: false,
    stripIgnoreTagBody: ["script"],
    stripIgnoreTag: false,
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
      console.log(`Ignoring tag attr: ${tag} ${name}="${value}"`);
      if (name.substring(0, 5) === "data-") {
        // escape its value using built-in escapeAttrValue function
        return name + '="' + escapeAttrValue(value) + '"';
      }
      if (name.substring(0, 5) === "aria-") {
        // Webflow-specific attributes, keep them
        return name + '="' + escapeAttrValue(value) + '"';
      }
      if (name.substring(0, 3) === "fs-") {
        // Webflow-specific attributes, keep them
        return name + '="' + escapeAttrValue(value) + '"';
      }
    },
  });
