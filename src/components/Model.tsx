import React, { JSX } from "react";
import { useGLTF } from "@react-three/drei";

import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    G3_LARC_GND_0824_1: THREE.Mesh;
    G3_LARC_GND_0824_2: THREE.Mesh;
    G3_LARC_GND_0824_3: THREE.Mesh;
    G3_LARC_GND_0824_4: THREE.Mesh;
    G3_LARC_GND_0824_5: THREE.Mesh;
    G3_LARC_GND_0824_6: THREE.Mesh;
    G3_LARC_GND_0824_7: THREE.Mesh;
    G3_LARC_GND_0824_8: THREE.Mesh;
  };
  materials: {
    PaintM: THREE.MeshStandardMaterial;
    MetalM: THREE.MeshStandardMaterial;
    GlassM: THREE.MeshStandardMaterial;
    PlasticM: THREE.MeshStandardMaterial;
    PaintPM: THREE.MeshStandardMaterial;
    RubberPM: THREE.MeshStandardMaterial;
    MetalPM: THREE.MeshStandardMaterial;
    GlassPM: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/G3_LARC_GND_0824.glb"
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_1.geometry}
          material={materials.PaintM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_2.geometry}
          material={materials.MetalM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_3.geometry}
          material={materials.GlassM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_4.geometry}
          material={materials.PlasticM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_5.geometry}
          material={materials.PaintPM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_6.geometry}
          material={materials.RubberPM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_7.geometry}
          material={materials.MetalPM}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.G3_LARC_GND_0824_8.geometry}
          material={materials.GlassPM}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/G3_LARC_GND_0824.glb");
