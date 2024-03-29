import React, { useEffect, useRef } from 'react';
import {useState, useMemo, useCallback} from 'react';
import Map, {Source, Layer, MapProvider, useMap} from 'react-map-gl';
import {MapView} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import AttributeTable from './components/attributeTable'
import Slide from '@mui/material/Slide';
import CustomGeoJsonLayer from './custom/custom-geojson-layer';
import EditButton from './components/editButton';
import { createLayers } from './util/create-layers';
import { buildingLayer } from './config/building-layer-config';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import KrpanoDialog from './krpano-dialog';
import ContextMenu from './components/context-menu';

const INITIAL_VIEW_STATE = {
  main: {
    longitude: 137.1509443,
    latitude: 35.0554637,
    zoom: 18,
    maxZoom: 23,
    pitch: 45
  },
  minimap: {
    longitude: 137.1509443,
    latitude: 35.0554637,
    zoom: 14,
    maxZoom: 23,
    pitch: 0
  }
};

const layerFilter = ({layer, viewport}) => {
  return layer.id.startsWith(viewport.id);
}

/* eslint-disable react/no-deprecated */
const DeckGLMap = ({
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  showMinimap = true
}) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [editFeature, setEditFeature] = useState(null);
  const [isAttributePanelOpen, setAttributePanelOpen] = useState(false);
  const [isKrpanoPanelOpen, setKrpanoPanelOpen] = useState(false);
  const [mapViews, setMapViews] = useState([
    new MapView({id: 'main', controller: true}),
    new MapView({
      id: 'minimap',
      x: document.body.clientWidth - 300 - 20,
      y: document.body.clientHeight - 300 - 20,
      width: 300,
      height: 300,
      // clear: true
    })
  ]);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [contextMenuShow, setContextMenuShow] = useState(false);
  const mapRef = React.useRef();
  const [mapboxgl, setMapboxgl] = useState();

  const onMapLoad = React.useCallback((a,b,c) => {
    console.log('***MApLoad:::', mapRef.current,mapRef.current.getMap());
    setMapboxgl(mapRef.current.getMap());

    // mapRef.current.on('click', (e) => {
    //   console.log('click',e);
    // })
    // mapRef.current.getMap().on('click', (e) => {
    //   console.log('click2',e);
    // })
    // mapRef.current.getMap().on('click', '3d-buildings', (e) => {
    //   console.log(e.features[0]);
    // })
    // mapRef.current.getMap().on('move', (e) => {
    //   console.log('move',e);
    // })
  }, []);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    setAnchorPoint(event.center);
    setContextMenuShow(true);
  }, [setAnchorPoint]);

  const handleAddPanorama = () => {
    setKrpanoPanelOpen(true);
    setContextMenuShow(false);
  }
  
  const onViewStateChange = useCallback(({viewState: newViewState}) => {
    // console.log('onViewStateChange',newViewState)
    setViewState(() => ({
      main: newViewState,
      minimap: {
        ...INITIAL_VIEW_STATE.minimap,
        longitude: newViewState.longitude,
        latitude: newViewState.latitude,
        // zoom: newViewState.zoom - 4,
      }
    }));
  }, []);

  const getTooltip = useCallback(info => {
    // ミニマップ上のツールチップは無視
    if (info.layer?.id.startsWith('minimap')) {
      return;
    }
  
    //マウスホバー位置に地物が存在するかチェックする
    if (!info || !info.object) return null;
    let obj = info.object;
  
    //geojsonレイヤーの場合はpropertiesの値をobjに入れる
    if (info.object.properties) obj = info.object.properties;
  
    //データからtr要素を生成する
    const trs = Object.keys(obj)
      .filter((key) => obj[key]) //値がnullや""のプロパティは省く
      .map(
        (key) =>
          `<tr><th style="text-align:right">${key}</th><td>${obj[key]}</td></tr>`
      )
      .join("\n");
  
    //tooltip内に出力するhtml要素を生成する
    const html = ["<table>", trs, "</table>"].join("\n");
  
    return {
      // tooltip内に出力するhtml要素を渡す
      html: html,
      // tooltip内のhtmlに適用するstyleを設定する
      style: {
        fontSize: "0.5em"
      }
    };
  }, []);

  const onMapClick = useCallback(async (info, event) => {
    // console.log('mapclick',info,mapRef.current.getMap())
    if (event.srcEvent.defaultPrevented) {
      console.log('eventPrevend')
      return;
    }

    const _map = mapRef.current.getMap();
    const bbox = [
      [info.x - 5, info.y - 5],
      [info.x + 5, info.y + 5]
    ];

    const selectedFeatures = _map.queryRenderedFeatures(bbox, {
      layers: ['3d-buildings']
    });

    if (selectedFeatures && selectedFeatures.length > 0) {
      alert(`高さ：${selectedFeatures[0].properties.height}`)
    }

    // mapboxgl.queryRenderedFeaturesInRect
    setAttributePanelOpen(false);
    setContextMenuShow(false);
  }, [])

  const handle2dClick = useCallback(() => {
    console.log('click')
    setViewState(() => ({
      main: {
        ...viewState.main,
        pitch: 0
      },
      minimap: {
        ...viewState.minimap,
      }
    }));
  });

  const handleEdit = useCallback(() => {
    console.log('edit')
    setViewState(() => ({
      main: {
        ...viewState.main,
        pitch: 0
      },
      minimap: {
        ...viewState.minimap,
      }
    }));

    setEditFeature(selectedFeature)
  });

  // const layers = [];
  const layers = createLayers({
    viewState,
    onFeatureClick: (feature, event) => {
      console.log('*** onFeatureClick', feature, event)
      // 右クリック？
      if (event.rightButton) {
        handleContextMenu(event);
      } else {
        setSelectedFeature(feature);
        if (feature.layer.id.indexOf('krpano') >= 0) {
          setKrpanoPanelOpen(true);
        } else {
          setAttributePanelOpen(true);
        }
      }
    }
  });

  if (editFeature) {
    const geojson = {
      "type": "FeatureCollection",
      "features": [{ "type": "Feature",
          "geometry": editFeature.object.the_geom,
          // "properties": {
          //   "name": "Location A",
          //   "category": "Store"
          // }
        }]
    }
    console.log('editFeature', geojson)
    layers.push(new EditableGeoJsonLayer({
      id: 'geojson-layer',
      data: geojson,
      mode: 'modifyMode',
      // selectedFeatureIndexes,

      onEdit: ({ updatedData }) => {
        console.log('onEdit', updatedData)
      }
    }));
  }

  const handleClose = () => {
    console.log('handleClose')
    setKrpanoPanelOpen(false)
  }
  // const scene = new ScenegraphLayer({
  //   id: 'ScenegraphLayer',
  //   data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
  //   _animations: {
  //     '*': {speed: 5}
  //   },
  //   _lighting: 'pbr',
  //   getOrientation: d => [0, Math.random() * 180, 90],
  //   getPosition: d => d.coordinates,
  //   scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
  //   sizeScale: 500,
  //   pickable: true,
  // });
  // layers.push(scene)

  return (
    <div onContextMenu={evt => evt.preventDefault()}>
      <DeckGL
        layers={layers}
        views={mapViews}
        viewState={viewState}
        parameters={{depthTest: false}}
        onViewStateChange={onViewStateChange}
        layerFilter={layerFilter}
        getTooltip={getTooltip}
        onClick={onMapClick}
      >
        <MapView id="main">
          <Map
            ref={mapRef}
            onLoad={onMapLoad}
            reuseMaps
            // mapStyle="mapbox://styles/ichiwaki/ckyo5tqot3nft15mpdm2e2s9u"
            mapStyle="mapbox://styles/ichiwaki/clc49x37b000114s8kf6dyw3t"
            mapboxAccessToken="pk.eyJ1IjoiaWNoaXdha2kiLCJhIjoiY2sxaDVjeDJhMDNhZTNob2NmejVjaTVqZSJ9.1i4ALY-MWwrPAhOw9HPljg"
          >
            {viewState.main.pitch >= 1 && <Layer {...buildingLayer}/>}
          </Map>
        </MapView>
        {/* <MapView id="minimap">
          <Map
            reuseMaps
            mapStyle="mapbox://styles/ichiwaki/cl1c8wc99007v14nxfwgbmg65"
            mapboxAccessToken="pk.eyJ1IjoiaWNoaXdha2kiLCJhIjoiY2sxaDVjeDJhMDNhZTNob2NmejVjaTVqZSJ9.1i4ALY-MWwrPAhOw9HPljg"
          />
        </MapView> */}
      </DeckGL>
      <EditButton onClick={handle2dClick} />
      <Slide direction="left" in={isAttributePanelOpen} mountOnEnter unmountOnExit>
        <div style={{position: 'absolute', right: 8, top: 8}}>
          <AttributeTable feature={selectedFeature} onEditClick={handleEdit} />
        </div>
      </Slide>
      <KrpanoDialog
        open={isKrpanoPanelOpen}
        onClose={handleClose}
      />
      {contextMenuShow ? <ContextMenu top={anchorPoint.y} left={anchorPoint.x} onAddPanorama={handleAddPanorama}/> : <></>}
    </div>
  );
}

export default DeckGLMap;
