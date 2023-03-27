import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import useLoadingState from "./useLoadingState";

const useIdPicker = () => {
  const { scene, raycaster, gl } = useThree();
  const canvas = gl.domElement;

  const { loaded, loader } = useLoadingState((state) => state);

  const idRef = useRef("");
  const [rayObjects, setRayObjects] = useState(null);

  useEffect(() => {
    if (loaded) {
      const model = scene.children.filter((mesh) => {
        const ifc = mesh.name === "ifc" && mesh;
        return ifc;
      });
      setRayObjects(model);
      canvas.addEventListener("dblclick", () => {
        console.log(idRef.current);
      });
      canvas.addEventListener("onmousemove", (event) => {
        highlight(event, preselectMat, preselectModel);
      });
    }
  }, [loaded]);

  useFrame(() => {
    if (rayObjects && rayObjects.length > 0) {
      raycaster.firstHitOnly = true;
      const obj = raycaster.intersectObjects(rayObjects);
      if (obj.length > 0 && loader && loaded) {
        const ifcObject = obj[0];
        const index = ifcObject.faceIndex;
        const ifcModel = ifcObject.object;
        const geometry = ifcModel.geometry;
        const ifc = loader.ifcManager;
        const id = index
          ? ifc.getExpressId(geometry, index).toString()
          : "";
        idRef.current = id;
      } else {
        idRef.current = "";
      }
    }
  });

  return;
};

export default useIdPicker;