"use client";

import React, { Suspense, JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";

export default function LarcScene(): JSX.Element {
  return (
    <Canvas
      className="w-full min-h-[50svh]"
      camera={{ position: [4, 2, 6], fov: 45 }}
      shadows
      dpr={[1, 2]}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={1} castShadow />

      {/* HDRI environment for pretty reflections */}
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Model />
      </Suspense>

      {/* Mouse-look */}
      <OrbitControls makeDefault enablePan={false} />
    </Canvas>
  );
}
