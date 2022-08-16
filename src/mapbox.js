import React, {useRef, useCallback} from 'react';
import Map, {Layer} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';
import {MVTLayer} from '@deck.gl/geo-layers';
import {PathLayer} from '@deck.gl/layers';
import {count} from '@deck.gl/core';
import colorConvert from 'color-convert';
import {binaryToGeojson} from '@loaders.gl/gis';
import {getDeckInstance, addLayer, removeLayer, updateLayer, drawLayer} from '@deck.gl/mapbox/src/deck-utils';

const pole = new MapboxLayer({
  id: 'ms_pole',
  type: MVTLayer,
  data: `https://cadix-tile.altlas.co.jp/mapserver.g_pole_polygon/{z}/{x}/{y}.mvt`,
  minZoom: 12,
  maxZoom: 23,
  filled: true, // true
  stroked: false, // false
  extruded: true, // false
  wireframe: true, // false
  getFillColor: [60, 60, 60, 100],
  getLineWidth: 5,
  sizeUnits: 'meters',
  getLineColor: [60, 60, 60, 100],
  lineWidthMinPixels: 1,
  getElevation: () => {
    // console.log('***getElevation');
    return 10;
  },

  pickable: true,
  // onHover: updateTooltip
  onClick: (feature, opt) => {
    console.log(feature, opt)
  },
});

// const messen = new MapboxLayer({
//   id: 'ms_messen',
//   type: MVTLayer,
//   data: `https://cadix-tile.altlas.co.jp/mapserver.g_messen/{z}/{x}/{y}.pbf?properties=cell_id,cell_name,color,cxf_attr_5,cxf_attr_6,dbf_id,dbf_name,f_seq_no,hatching_code,height`,
//   // minZoom: 12,
//   // maxZoom: 23,
//   filled: false, // true
//   stroked: true, // false
//   extruded: true, // false
//   wireframe: true, // false
//   // getFillColor: [200, 200, 200, 150],
//   getLineWidth: 2,
//   sizeUnits: 'meters',
//   getLineColor: f => {
//     if (f.properties.color) {
//       return colorConvert.hex.rgb(f.properties.color);
//     }
//     return [255, 255, 255];
//   },
//   lineWidthMinPixels: 1,

//   pickable: true,
//   // onHover: updateTooltip
//   onClick: (feature, opt) => {
//     console.log(feature, opt)
//   },
//   renderSubLayers: props => {
//     const {tile} = props;
//     const data = tile.dataInWGS84.map(feature => {
//       const coordinates = feature.geometry.coordinates;
//       // console.log('feature', feature)
//       return {
//         "name": "aaa",
//         "color": feature.properties.color,
//         "path": coordinates.map(coord => [...coord, 9]),
//       }
//     })

//     pathData.push(...data);
//     console.log('pathData', pathData)

//     const layer = map.getLayer('path-layer')
//     console.log('layer',layer,a,b,c)
//     updateLayer(layer.implementation.deck, layer)

//     return;
//   },
// });

const pathData = [];
const path = new MapboxLayer({
  id: 'path-layer',
  type: PathLayer,
  numInstances:100,
  // data: pathData,
  // pickable: true,
  // widthScale: 20,
  // widthMinPixels: 2,
  getPath: d => d.path,
  getColor: d => {
    const hex = d.color;
    // convert to RGB
    return hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
  },
  getWidth: d => .5,
  onClick: (feature, opt) => {
    console.log(feature, opt)
  },
  renderSubLayers: props => {
    console.log('props',props)
  },
});


const INITIAL_VIEW_STATE = {
  longitude: 137.1509443,
  latitude: 35.0554637,
  zoom: 18,
  maxZoom: 23,
  pitch: 45
};

const Mapbox = () => {
  const mapRef = useRef(null);
  const onMapLoad = useCallback(() => {
    const map = mapRef.current.getMap();
    console.log('>>>map',map)
    map.on('moveend', () => console.log('moveend'))
    map.on('mapload', () => console.log('load'))
    // map.on('render', (a,b,c) => console.log('render',a,b,c))
    map.on('idle', (a,b,c) => {
      // map.removeLayer('path-layer')
      // map.addLayer(path)
    })
    const firstLabelLayerId = map.getStyle().layers.find(layer => layer.type === 'symbol').id;

    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
          'fill-extrusion-color': '#aaa',

          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "height"]
          ],
          'fill-extrusion-base': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "min_height"]
          ],
          'fill-extrusion-opacity': .6
      }
    }, firstLabelLayerId);

    // map.addLayer(path)
    map.addLayer(pole);
    map.addLayer(new MapboxLayer({
      id: 'ms_messen',
      type: MVTLayer,
      data: `https://cadix-tile.altlas.co.jp/mapserver.g_messen/{z}/{x}/{y}.pbf?properties=cell_id,cell_name,color,cxf_attr_5,cxf_attr_6,dbf_id,dbf_name,f_seq_no,hatching_code,height`,
      // minZoom: 12,
      // maxZoom: 23,
      filled: false, // true
      stroked: true, // false
      extruded: true, // false
      wireframe: true, // false
      // getFillColor: [200, 200, 200, 150],
      getLineWidth: 2,
      sizeUnits: 'meters',
      getLineColor: f => {
        if (f.properties.color) {
          return colorConvert.hex.rgb(f.properties.color);
        }
        return [255, 255, 255];
      },
      lineWidthMinPixels: 1,
    
      pickable: true,
      // onHover: updateTooltip
      onClick: (feature, opt) => {
        console.log(feature, opt)
      },
      onHover: d => console.log('mvt:hover:',d),
      renderSubLayers: props => {
        const {tile} = props;
        const data = tile.dataInWGS84.map(feature => {
          const coordinates = feature.geometry.coordinates;
          // console.log('feature', feature)
          return {
            "id": 1,
            "name": "aaa",
            "color": feature.properties.color,
            "path": coordinates.map(coord => [...coord, 9]),
          }
        })
/*    
        pathData.push(...data);
        console.log('pathData', pathData)
    
        const layer = map.getLayer('path-layer')
        console.log('layer',layer)
        // layer.implementation.setProps({data});
        // layer.implementation.render();
        updateLayer(layer.implementation.deck, layer)
*/
        // const ret = count(data);
        // console.log('count',ret)
        // if (data.length === 0) {
        //   console.log('length0')
        //   return;
        // }
        return new PathLayer({
          id: props.id,
          type: PathLayer,
          numInstances:1000, //これ指定しないとluma.glのassertで例外になる。100が適切なのかは不明
          data,
          pickable: true,
          // widthScale: 20,
          // widthMinPixels: 2,
          getPath: d => d.path,
          getColor: d => {
            const hex = d.color;
            // convert to RGB
            return hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
          },
          getWidth: d => .5,
          // onClick: (feature, opt) => {
          //   console.log(feature, opt)
          // },
          onClick: d => console.log(d),
          onHover: d => console.log(d)
        });
        
        return;
      },
    }))
  });

  return (
    <Map
      ref={mapRef}
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle="mapbox://styles/ichiwaki/ckyo5tqot3nft15mpdm2e2s9u"
      onLoad={onMapLoad}
    >
      {/* <Layer {...pole} /> */}
    </Map>
  );
}

export default Mapbox;