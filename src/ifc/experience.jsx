import React from 'react';
import { OrbitControls } from "@react-three/drei";
import Model from "./model";

const Experience = () => {
  return (
    <>
      <Model />
      <ambientLight intensity={0.5} />
      <OrbitControls makeDefault />;
    </>
  );
};

export default Experience;