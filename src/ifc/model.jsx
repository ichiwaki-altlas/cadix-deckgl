import React from 'react';
import { useLoader } from "@react-three/fiber";
import { IFCLoader } from "web-ifc-three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import useLoadingState from '../hooks/useLoadingState';

const Model = () => {
  const { setLoader, setLoaded } = useLoadingState((state) => state);

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

      loader.ifcManager.setOnProgress((event) => {
        const ratio = event.loaded / event.total;
        ratio === 1 && setLoaded(true);
      });

      setLoader(loader);
    },
  );

  model.name = 'ifc';

  return (
    <primitive object={model} />
  )
};

export default Model;