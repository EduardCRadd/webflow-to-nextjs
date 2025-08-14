import { CheerioAPI } from "cheerio";
//
// export const getHtmlDataAttrs = ($: CheerioAPI) => {
//   const attrs: Record<string, string> = {};
//
//   const htmlEl = $("html").get(0);
//   if (htmlEl?.attribs) {
//     Object.entries(htmlEl.attribs).forEach(([k, v]) => {
//       if (k.startsWith("data-") && typeof v === "string") {
//         attrs[k] = v;
//       }
//     });
//   }
//   return attrs;
// };

export function getHtmlDataAttrs($: CheerioAPI) {
  const attrs: Record<string, string> = {};
  Object.entries($("html")[0].attribs).forEach(([key, val]) => {
    if (
      key.startsWith("data-") ||
      key === "dir" ||
      key === "lang" ||
      key === "class"
    ) {
      attrs[key] = val!;
    }
  });
  return attrs;
}
