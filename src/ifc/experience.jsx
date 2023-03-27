import React, { createContext, useEffect, useState } from 'react';
import { OrbitControls } from "@react-three/drei";
import Model from "./model";
import useIdPicker from '../hooks/useIdPicker';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import IFCContainer from './IFCContainer';
import {
  IfcAPI, IFCRELDEFINESBYPROPERTIES
} from "web-ifc/web-ifc-api";
import useIfcAPI from '../hooks/useIfcAPI';

const Experience = () => {
  const [ifc, setIfc] = useState(null);
  const { setIfcAPI } = useIfcAPI((state) => state);


  const ifcLoader = new IFCLoader();
  const manager = ifcLoader.ifcManager;
  manager.setWasmPath('../../');

  useEffect(() => {
    const ifcAPI = new IfcAPI();
    ifcAPI.SetWasmPath("../../");
    ifcAPI.Init();
    setIfcAPI(ifcAPI);
  }, [])

  // function handleFileUpload(event: Event) {
  //   const file = event.target.files[0];
  //   const fileUrl = URL.createObjectURL(file);
  //   ifcLoader.load(fileUrl, (ifc) => setIfc(ifc));
  // }

  useEffect(() => {
    // ifcLoader.load("/BasicHouse.ifc", (ifc) => setIfc(ifc));
    ifcLoader.load("/01.ifc", (ifc) => setIfc(ifc));
  }, []);

  return (
    <>
      <ambientLight color={0xffffff} intensity={0.5} />
      <directionalLight color={0xffffff} intensity={1} position={[0, 10, 0]} target-position={[-5, 0, 0]}/>
      <gridHelper size={50} divisions={30} />
      <OrbitControls makeDefault />;
      <IFCContainer ifc={ifc} manager={manager} />
    </>
  );
};

export default Experience;