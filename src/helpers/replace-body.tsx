import FeatureCardGrid from "@/components/featureCards/FeatureCardGrid";
import {
  DOMNode,
  Element,
  domToReact,
  attributesToProps,
} from "html-react-parser";
import Link from "next/link";

import LarcSceneWrapper from "@/components/LarcSceneWrapper";

export const replaceBody = (node: DOMNode) => {
  if (node instanceof Element && node.attribs) {
    // if (
    //   node.name === "a" &&
    //   node.attribs["data-button-value"] === "banana-quiz"
    // ) {
    //   return replaceButtonToQuiz(node);
    // }

    // …add other replacements here…
    if (node.name === "div" && node.attribs["data-feature-card-grid"]) {
      return <FeatureCardGrid />;
    }

    if (
      node.name === "div" &&
      node.attribs &&
      "data-larc-scene" in node.attribs
    ) {
      return <LarcSceneWrapper />;
    }
  }
};

// const replaceButtonToQuiz = (node: Element) => {
//   // Strip the original href; keep other attributes (class, style, etc.)
//   const { href, ...rest } = attributesToProps(node.attribs);
//
//   return (
//     <Link
//       href="/banana-quiz/question-0"
//       {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
//       // className="bg-red-600 border-green-400"
//     >
//       {!!node.children?.length &&
//         domToReact(node.children as unknown as DOMNode[])}
//     </Link>
//   );
// };
