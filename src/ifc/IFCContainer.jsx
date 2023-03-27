import { useBVH } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { MeshLambertMaterial, Vector2 } from 'three';
import {
  IFCRELDEFINESBYPROPERTIES
} from "web-ifc/web-ifc-api";
import useIfcAPI from '../hooks/useIfcAPI';

const highlightMaterial = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff00ff,
  depthTest: false,
});

export default function IFCContainer({ ifc, manager }) {
  const ifcAPI = useIfcAPI((state) => state.ifcAPI);
  const [highlightedModel, setHighlightedModel] = useState({ id: -1 });
  const { gl, camera } = useThree();
  const canvas = gl.domElement;

  const mesh = useRef(null);
  useBVH(mesh);

  const {scene, raycaster} = useThree();

  useEffect(() => {
    raycaster.firstHitOnly = true;
    if (ifc) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [ifc, highlightedModel])

  const handleMouseMove = (event) => {
    const found = cast(event);
    highlight(found[0], highlightMaterial);
  }

  function cast(event) {
    // スクリーン上のマウスの位置を計算する
    const bounds = canvas.getBoundingClientRect();
    const mouse = new Vector2();

    const x1 = event.clientX - bounds.left;
    const x2 = bounds.right - bounds.left;
    mouse.x = (x1 / x2) * 2 - 1;
  
    const y1 = event.clientY - bounds.top;
    const y2 = bounds.bottom - bounds.top;
    mouse.y = -(y1 / y2) * 2 + 1;
  
    // マウスを指し示すカメラの上に置く
    raycaster.setFromCamera(mouse, camera);
  
    // 光線を当てる
    return raycaster.intersectObjects([ifc]);
  }

  function handleClick(event) {
    console.log('handle',event)
    console.log('ifcAPI',ifcAPI)
    const { modelID, geometry } = event.object;
    const id = manager.getExpressId(geometry, event.faceIndex);

    const element = ifcAPI.GetLine(modelID, id);
    // const element = ifcAPI.GetAllLines(modelID);
    console.log('element',element)
  }

  function highlight(intersection, material) {
    if (Object.keys(manager.state.models).length) {
      manager.removeSubset(highlightedModel.id, highlightMaterial);
    }

    if (!intersection) {
      return;
    }

    const { faceIndex } = intersection;
    const { modelID, geometry } = intersection.object;
    const id = manager.getExpressId(geometry, faceIndex);

    setHighlightedModel({ id: modelID });

    manager.state.models[modelID] = ifc;

    manager.createSubset({
      modelID,
      ids: [id],
      material,
      scene,
      removePrevious: true,
    });
  }

  return ifc ? (
    // <primitive ref={mesh} object={ifc} onPointerMove={handleDblClick} />
    <primitive ref={mesh} object={ifc} onClick={handleClick} />
  ) : null;
}
