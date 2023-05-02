import { CameraProjections, IfcViewerAPI } from 'web-ifc-viewer';
import {
  IFCSPACE, IFCOPENINGELEMENT, IFCFURNISHINGELEMENT, IFCWALL, IFCWINDOW, IFCCURTAINWALL, IFCMEMBER, IFCPLATE
} from 'web-ifc';
import {
  MeshBasicMaterial,
  LineBasicMaterial,
  Color,
  Vector2,
  DepthTexture,
  WebGLRenderTarget, Material, BufferGeometry, BufferAttribute, Mesh
} from 'three';
import { ClippingEdges } from 'web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges';
import Stats from 'stats.js/src/Stats';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Loader from 'react-loader-spinner'
import IfcPropertyTable from '../components/ifc-property-table';
import IfcFloorTable from '../components/ifc-floor-table';
import Slide from '@mui/material/Slide';

const ViewerContext = createContext();

const IFCViewer = () => {
  const viewerRef = useRef(null)
  const [viewer, setViewer] = useState(null)
  const [property, setProperty] = useState(false)
  
  useEffect(() => {
    console.log('***viewerRef.current',viewerRef.current)
    if (!viewerRef.current) {
      return
    }
    const _viewer = new IfcViewerAPI({
      container: viewerRef.current,
      backgroundColor: new Color(255, 255, 255)
    });
    // viewer.axes.setAxes();
    // viewer.grid.setGrid();
    // viewer.shadowDropper.darkness = 1.5;
    _viewer.context.ifcCamera.cameraControls

    _viewer.IFC.setWasmPath('../../');
    
    _viewer.IFC.loader.ifcManager.applyWebIfcConfig({
      USE_FAST_BOOLS: true,
      COORDINATE_TO_ORIGIN: true
    });
    
    _viewer.context.renderer.postProduction.active = true;
    
    _viewer.IFC.loader.ifcManager.parser.setupOptionalCategories({
      [IFCSPACE]: false,
      [IFCOPENINGELEMENT]: false
    });

    (async () => {
      const res = await fetch('/sample_bim.ifc')
      const blob = await res.blob()
      const file = new File([blob], 'sample_bim.ifc', { type: blob.type })

      const _model = await _viewer.IFC.loadIfc(file, false);
      // model.material.forEach(mat => mat.side = 2);
    
      // if(first) first = false
      // else {
      //   ClippingEdges.forceStyleUpdate = true;
      // }
    
      // await createFill(model.modelID);
      // const lineMaterial = new LineBasicMaterial({ color: 0x555555 });
      // const baseMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });
      // viewer.edges.create(`${model.modelID}`, model.modelID, lineMaterial, baseMaterial);
    
      await _viewer.shadowDropper.renderShadow(_model.modelID);

      setViewer(_viewer)
    })()

    return () => {
      console.log('dispose!!!')
      _viewer?.dispose()
    }
  }, [])

  useEffect(() => {
    if (!viewer) {
      return
    }

    window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
    window.addEventListener("keydown", handleKeyDown);
    window.ondblclick = async () => {
      if (viewer.clipper.active) {
        console.log('***1-1')
        viewer.clipper.createPlane();
      } else {
        console.log('***1-2')
        const result = await viewer.IFC.selector.highlightIfcItem(true);
        if (!result) return;
        const { modelID, id } = result;
        let props = await viewer.IFC.getProperties(modelID, id, true, false);
        props = JSON.parse(JSON.stringify(props));
  
        console.log(props);
        setProperty(props)
      }
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [viewer]);

  const handleKeyDown = (event) => {
    console.log('handleKeydown2', event.code, viewer)
    if (event.code === 'Escape') {
      viewer.IFC.selector.unHighlightIfcItems();
      setProperty(null)
    }
  }

  return (
    <ViewerContext.Provider value={viewer}>
      <div style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
      }} ref={viewerRef}>
        <div style={{position: 'absolute', left: 8, top: 8}}>
          <IfcFloorTable />
        </div>
      </div>
      {property &&
        <Slide direction="left" in={property} mountOnEnter unmountOnExit>
          <div style={{position: 'absolute', right: 8, top: 72}}>
            <IfcPropertyTable property={property} />
          </div>
        </Slide>
      }
    </ViewerContext.Provider>
  )
}

export default IFCViewer
export const useViewerContext = () => useContext(ViewerContext);