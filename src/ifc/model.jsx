import React from 'react';
import { useLoader } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

const Model = () => {
  const model = useLoader(
    IFCLoader,
    "/test.ifc",
    (loader) => {
      loader.ifcManager.setupThreeMeshBVH(
        computeBoundsTree,
        disposeBoundsTree,
        acceleratedRaycast
      );
      loader.ifcManager.setWasmPath("../../");
    }
  );

 model.name = 'ifc';

  return <primitive object={model} />;
};

export default Model;