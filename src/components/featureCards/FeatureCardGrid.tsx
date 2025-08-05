"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image, { type StaticImageData } from "next/image";
import type { FC } from "react";
import { useRef } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import enterpriseSVG from "@/assets/svgs/templates-enterprise-integration.svg";
import logicBasedSVG from "@/assets/svgs/templates-logic-based.svg";
import flexibleSVG from "@/assets/svgs/templates-flexible-front-end.svg";

export type FeatureProps = {
  image: StaticImageData;
  title: string;
  description: string;
};

type Props = {
  features?: FeatureProps[];
  className?: string;
};

const FeatureCardGrid: FC<Props> = ({ features, className }) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const matchMedia = gsap.matchMedia();

      const animateFeatures = (staggerParams: gsap.StaggerVars) => {
        if (!container.current) return;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: container.current,
              start: "top 80%",
              once: true,
            },
          })
          .fromTo(
            ".feature-card",
            { opacity: 0, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: staggerParams,
            },
          )
          .fromTo(
            ["p", "h5"],
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: staggerParams,
            },
          );
      };

      // Mobile
      matchMedia.add("(max-width: 640px)", () => {
        const staggerParams: gsap.StaggerVars = {
          each: 0.1,
          from: "start",
          grid: "auto",
          ease: "power2.inOut",
        };
        animateFeatures(staggerParams);
      });

      // Desktop
      matchMedia.add("(min-width: 641px)", () => {
        const staggerParams: gsap.StaggerVars = {
          each: 0.05,
          from: "center",
          grid: "auto",
        };
        animateFeatures(staggerParams);
      });
    },
    { scope: container, dependencies: [] },
  );

  const cardWidthClass =
    PRIMARY_FEATURES.length % 3 === 0
      ? "md:w-1/2 lg:w-1/3"
      : PRIMARY_FEATURES.length % 4 === 0
        ? "md:w-1/2 lg:w-1/4"
        : "md:w-1/2 lg:w-1/3";

  return (
    <section
      ref={container}
      className={twMerge(
        "relative flex! w-full flex-wrap justify-center global-padding",
        className,
      )}
    >
      {PRIMARY_FEATURES.map((feature, index) => (
        <div
          key={feature.title.split(" ").join("-") + index}
          className={twMerge("w-full p-5 md:p-3.5", cardWidthClass)}
        >
          <div
            className={twMerge(
              "feature-card size-full rounded-xl bg-rose-white opacity-0 shadow-2xl shadow-onyx/5",
              features?.length === 4
                ? "px-5 py-8 lg:px-7 lg:py-8 xl:px-11 xl:py-11"
                : "px-5 py-8 lg:px-6 lg:py-9 xl:px-9 xl:py-9",
            )}
          >
            <Image
              src={feature.image}
              alt={feature.title}
              className={twJoin(
                "size-9 md:size-20",
                features?.length === 4 ? "mb-3 md:mb-7" : "mb-3 md:mb-5",
              )}
            />
            <h5 className="pb-1 text-body-xs opacity-0 md:pb-4 md:text-h5">
              {feature.title}
            </h5>
            <p className="text-dropdown-item opacity-0 md:text-body-xs">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureCardGrid;

const PRIMARY_FEATURES: FeatureProps[] = [
  {
    image: enterpriseSVG,
    title: "Enterprise approved integration",
    description:
      "Integrate with your brand’s global systems and CRM/CDPs for enterprise level compliance.",
  },
  {
    image: logicBasedSVG,
    title: "Logic-based building blocks",
    description:
      "Select from pre-built digital building blocks that deliver superb user experience based on years of connected product executions.",
  },
  {
    image: flexibleSVG,
    title: "Flexible front end",
    description:
      "Use our SDK to drive experiences using your existing front-end designs or choose from our selection of out-the-box front-end templates.",
  },
];
