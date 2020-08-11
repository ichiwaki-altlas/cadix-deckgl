/* global window */
import React, {useEffect, useState} from 'react';
import DeckGL from '@deck.gl/react';
import {BitmapLayer, IconLayer} from '@deck.gl/layers';
import {TileLayer, MVTLayer} from '@deck.gl/geo-layers';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
const Pbf = require('pbf');
import {decode} from 'geobuf';
import MapGL from 'react-map-gl';
import {MapStylePicker} from './controls';
// import { Toolbox } from '@nebula.gl/editor';
import { Toolbox } from './toolbox';
import { ViewMode } from '@nebula.gl/edit-modes';
import colorConvert from 'color-convert';

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12,
};

const myFeatureCollection = {
  type: "FeatureCollection",
  features: [
    /* insert features here */
  ]
};
const App = ({viewState}) => {
  const [features, setFeatures] = useState({
    type: 'FeatureCollection',
    features: [],
  });
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);
  // const selectedFeatureIndexes = [];
  const [mode, setMode] = useState(() => ViewMode);
  // const [style, setStyle] = useState('mapbox://styles/mapbox/light-v9');
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    longitude: 136.93,
    latitude: 35.12,
    zoom: 18,
    maxZoom: 23,
    pitch: 45
  });
  // const [data, setData] = useState(myFeatureCollection);
  const [data, setData] = useState([]);

  const basemapLayer = new TileLayer({
    data: [
        "http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "http://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "http://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "http://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    ],
    minZoom: 0,
    maxZoom: 23,
    tileSize: 256,
  
    renderSubLayers: props => {
          const {
            bbox: {west, south, east, north}
          } = props.tile;
  
          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north]
          });
    }
  });
  const t2houseLayer = new MVTLayer({
    id: 'house',
    // data: `http://localhost:3000/tile/townii/poly_house/{z}/{x}/{y}.mvt`,
    data: `http://localhost:3000/tile/osm/planet_osm_polygon/{z}/{x}/{y}.mvt`,
    minZoom: 16,
    maxZoom: 23,
    filled: true, // true
    stroked: true, // false
    extruded: true, // false
    wireframe: true, // false
    getLineColor: [192, 192, 192],
    getFillColor: [200, 200, 200, 150],
    getLineWidth: 0.1,
    // opacity: 0.5,
    getElevation: () => {
      // console.log('***getElevation');
      return 9;
    }
  });
  
  const t2roadLayer = new MVTLayer({
    id: 'road',
    // data: `http://localhost:3000/tile/townii/line_road/{z}/{x}/{y}.mvt`,
    data: `http://localhost:3000/tile/osm/planet_osm_line/{z}/{x}/{y}.mvt`,
    minZoom: 16,
    maxZoom: 23,
    getLineColor: [120, 120, 120],
    getFillColor: [140, 170, 180],
  
    // sizeUnits: 'meters',
    getLineWidth: f => {
      return 1;
    },
    lineWidthMinPixels: 0,
  });
  
  const msMessenLayer = new MVTLayer({
    id: 'ms_messen',
    data: `http://localhost:3000/tile/ms/g_messen/{z}/{x}/{y}.mvt`,
    minZoom: 12,
    maxZoom: 23,
    filled: false, // true
    stroked: true, // false
    extruded: true, // false
    wireframe: true, // false
    getFillColor: [200, 200, 200, 150],
    getLineWidth: 5,
    sizeUnits: 'meters',
    getLineColor: f => {
      if (f.properties.color) {
        return colorConvert.hex.rgb(f.properties.color);
      }
      return [255, 255, 255];
    },
    // getFillColor: [140, 170, 180],
  
    // getLineWidth: f => {
    //   if (f.properties.mrf_attr_28) {
    //     return f.properties.mrf_attr_28;
    //   }
    //   return 1;
    // },
    lineWidthMinPixels: 1,
    getElevation: () => {
      // console.log('***getElevation');
      return 11;
    },

    pickable: true,
    // onHover: updateTooltip
    onClick: (feature, opt) => {
      console.log(feature, opt)
    },
  });

  const msPoleLayer = new MVTLayer({
    // id: 'ms_pole',
    // data,
    // minZoom: 12,
    // maxZoom: 23,
    // getLineColor: [200,200,100],
    // getFillColor: [140, 170, 180],
    // sizeScale: 5,
    // getLineWidth: f => {
    //     return 2;
    // },
    // getIcon: f => {
    //   if (f.properties.f_seq_no == 1 && f.properties.mrf_attr_37) {
    //     return {
    //       url: `/images/svg/${f.properties.mrf_attr_37}.svg`,
    //       width: 64,
    //       height: 64
    //     };
    //   } else {
    //     return {
    //       url: '/images/icon_rss.svg',
    //       width: 64,
    //       height: 64
    //     };
    //   }
    // },
    // getPosition: f => {
    //   return f.geometry.coordinates;
    // },
    // getColor: f => {
    //   return [255, 255, 255, 255];
    // },
    // getSize: f => {
    //   return f.properties.mrf_attr_32; // 1
    // },
    // getAngle: f => {
    //   return f.properties.mrf_attr_31; // 0
    // },
    // sizeUnits: 'meters',
    // lineWidthMinPixels: 1,
  
    // pickable: true,
    // // onHover: updateTooltip
    // onClick: (feature, opt) => {
    //   console.log(feature, opt)
    // },
    id: 'ms_pole',
    data: `http://localhost:3000/tile/ms/g_pole/{z}/{x}/{y}.mvt`,
    minZoom: 12,
    maxZoom: 23,
    filled: true, // true
    stroked: false, // false
    extruded: true, // false
    wireframe: true, // false
    getFillColor: [255, 100, 70, 150],
    getLineWidth: 5,
    sizeUnits: 'meters',
    getLineColor: [200, 0, 0],
    // getFillColor: [140, 170, 180],
  
    // getLineWidth: f => {
    //   if (f.properties.mrf_attr_28) {
    //     return f.properties.mrf_attr_28;
    //   }
    //   return 1;
    // },
    lineWidthMinPixels: 1,
    getElevation: () => {
      // console.log('***getElevation');
      return 12;
    },

    pickable: true,
    // onHover: updateTooltip
    onClick: (feature, opt) => {
      console.log(feature, opt)
    },
  });

  // const editableLayer = new EditableGeoJsonLayer({
  //   id: 'geojson',
  //   data,
  //   mode,
  //   selectedFeatureIndexes,
  //   getLineColor: (f) => {
  //     let color = [200,200,100];
  //     if (f.properties.color) {
  //       color = colorConvert.hex.rgb(f.properties.color);
  //     }
  //     return color;
  //   },
  //   getFillColor: (f) => {
  //     let color = [140, 170, 180];
  //     if (f.properties.color) {
  //       color = colorConvert.hex.rgb(f.properties.color);
  //     }
  //     return color;
  //   },
  //   editHandleType: 'icon',
  //   getEditHandleIcon: (f) => {
  //     console.log('getEditHandleIcon');
  //     return {
  //       url: '/images/icon_rss.svg',
  //       width: 128,
  //       height: 128
  //     }
  //   },
  //   getEditHandleIconAngle: (f) => {
  //     console.log('getEditHandleIconAngle');
  //     return 45
  //   },
  //   editHandleIconSizeUnits: 'meters',
  //   editHandleIconSizeScale: 1,
  //   getEditHandleIconSize: 10,
  //   // getEditHandleIconColor: getEditHandleColor,
  //   // getEditHandleIconAngle: 0,
  //   _subLayerProps: {
  //     // geojson: {
  //     //   getIcon: (f) => {
  //     //     // console.log('getIcon');
  //     //   },
  //       // getFillColor: (f) => {
  //         // console.log('getFillColor');
  //       // }
  //     // }
  //   },

  //   onEdit: ({ updatedData }) => {
  //     setData(updatedData);
  //   },
  //   onClick: (feature, opt) => {
  //     console.log(feature);
  //     setSelectedFeatureIndexes([feature.index]);
  //   },
  // });

  useEffect(() => {
    console.log('useEffect[data]', data);
    // editableLayer.setState({data: data});
    msPoleLayer.setState({data: data});
  }, [data]);
  useEffect(() => {
    console.log('useEffect[]');
    (async () => {
      // const messen = await fetch('http://localhost:3000/feature/g_messen')
      // .then(res => res.arrayBuffer())
      // .then(arraybuffer => decode(new Pbf(arraybuffer)));

      const pole = await fetch('http://localhost:3000/feature/g_pole')
      .then(res => res.arrayBuffer())
      .then(arraybuffer => decode(new Pbf(arraybuffer)));
      console.log('useEffect[] pole', pole);

      // messen.features = messen.features.concat(pole.features);
      // setData(messen);
      setData(pole.features);
    })();

    return () => console.log('unmounting...');
  }, []);
  
  const layers = [
    basemapLayer,
    t2houseLayer,
    t2roadLayer,
    msMessenLayer,
    msPoleLayer,
    // editableLayer
  ];

  //resize
  useEffect(() => {
    const handleResize = () => {
        setViewport((v) => {
            return {
                ...v,
                width: window.innerWidth,
                height: window.innerHeight
            };
        });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // const onStyleChange = (style) => {
  //   setStyle(style);
  // }

  // const _onViewportChange = (_viewport) => {
  //   setViewport({ ...viewport, ..._viewport });
  // }

  // const _resize = () => {
  //   console.log('resize');
  //   _onViewportChange({
  //     width: window.innerWidth,
  //     height: window.innerHeight
  //   });
  // }
  // window.addEventListener('resize', _resize);
//  _resize();

  
  return (
      <div>
        <DeckGL
          controller={{
            doubleClickZoom: false,
          }}
          initialViewState={{...viewport}}
          layers={[layers]}
          viewState={viewState}
          onViewportChange={setViewport}
          // getCursor={editableLayer.getCursor.bind(editableLayer)}
        />
        <Toolbox
          mode={mode}
          features={features}
          onSetMode={setMode}
        />
      </div>
    );
  }

  export default App;