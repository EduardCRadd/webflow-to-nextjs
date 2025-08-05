"use client";

import dynamic from "next/dynamic";
import React from "react";

const LazyLarcScene = dynamic(() => import("@/components/LarcScene"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "2000px", background: "#000" }} />
  ),
});

export default function LarcSceneWrapper() {
  return <LazyLarcScene />;
}
