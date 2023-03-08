import {PathLayer} from '@deck.gl/layers';
import {MVTLayer} from '@deck.gl/geo-layers';
import {PBFLoader} from '../loader/pbfloader'
import {GLTFLoader} from '@loaders.gl/gltf';
import {WebMercatorViewport} from '@deck.gl/core';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import {GeoJsonLayer} from '@deck.gl/layers';
import {IconLayer} from '@deck.gl/layers';

const dummy = `
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="rgb(0, 0, 0)" stroke="#fa1" stroke-width="2"/>
</svg>
`;

export const createLayers = ({viewState, onFeatureClick, isPlateau}) => {

  const {width} = viewState.main;
  if (!width) return null;
  const viewport = new WebMercatorViewport(viewState.main);
  const bbox = viewport.getBounds();

  const API_SERV_HOST = process.env.REACT_APP_API_SERV_HOST;
  const TILE_SERV_HOST = process.env.REACT_APP_TILE_SERV_HOST;
  console.log('***API_SERV_HOST', API_SERV_HOST)
  console.log('***TILE_SERV_HOST', TILE_SERV_HOST)

  const layers = [];
  if (viewState.main.pitch < 1) {
    layers.push(...[
      new MVTLayer({
        id: `main-ms_messen`,
        data: `${TILE_SERV_HOST}/mapserver.g_messen,mapserver.g_cable_fl/{z}/{x}/{y}.mvt`,
        // minZoom: 12,
        // maxZoom: 23,
        jointRounded: true,
        filled: false, // true
        stroked: true, // false
        extruded: true, // false
        wireframe: true, // false
        // getLineWidth: .1,
        sizeUnits: 'meters',
        lineWidthMinPixels: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 0, 0, 100],
        uniqueIdProperty: 'callSign',
        pointType: 'icon+text',
        // highlightedFeatureId: highlight,
        // getLinePath: d => {
        //   console.log('getLinePath1',d)
        //   return d.path;
        // },
        textSizeUnits: 'meters',
        textBillboard: false,
        getText: d => d.properties.mrf_attr_37,
        getTextColor: d => {
          const hex = d.properties.color;
          const color = hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
          return [...color, 255];
        },
        getTextSize: d => d.properties.mrf_attr_32 * 2,
        getTextAngle: d => {
          // console.log('angle',d.properties.mrf_attr_31)
          return parseInt(d.properties.mrf_attr_31);
        },
        getLineColor: d => {
          // console.log('getcolor',d)
          const hex = d.properties.color;
          const color = hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
          return [...color, 255];
        },
        getLineWidth: d => .3,
        onClick: (feature, event) => {
          console.log(feature, event)
          if (event.srcEvent.defaultPrevented) {
            return true;
          }
          onFeatureClick(feature)
          return true;
        },
      }),
      new MVTLayer({
        id: 'main-ms_pole',
        data: `${TILE_SERV_HOST}/mapserver.g_pole/{z}/{x}/{y}.mvt?filter=f_seq_no=1`,
        minZoom: 12,
        maxZoom: 23,
        filled: true, // true
        stroked: false, // false
        extruded: true, // false
        wireframe: true, // false
        getFillColor: [60, 60, 60, 40],
        getLineWidth: 5,
        sizeUnits: 'meters',
        getLineColor: [60, 60, 60, 40],
        lineWidthMinPixels: 1,
        pointType: 'icon+text',
        iconSizeUnits: 'meters',
        iconSizeScale: 1,
        getIcon: (d) => {
          // console.log('***getIcon',d.properties, d.properties.f_seq_no);
          try {
            const icon = require(`../../svg/${d.properties.name}.svg`).default;
            if (icon) {
              return {
                // url: `images/svg/${d.properties.name}.svg`,
                url: icon,
                width: parseInt(d.properties.width),
                height: parseInt(d.properties.height),
              };
            }
          } catch (error) {
            // console.log('error')
            // dummy
            return {
              url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dummy)}`,
              // width: d.properties.width,
              // height: d.properties.height,
            }
          }
        },
        getIconSize: d => 1,
        getIconAngle: d => d.properties.mrf_attr_31,
        getIconColor: d => {
          // console.log('***Color',d.properties.color)
          return [255, 0, 0, 255];
        },
        pickable: true,
        // onHover: updateTooltip
        onClick: (feature, opt) => {
          // console.log(feature, opt)
        },
      }),
      new MVTLayer({
        id: 'main-ms_device',
        data: `${TILE_SERV_HOST}/mapserver.g_connect,mapserver.g_port_ps,mapserver.g_ps,mapserver.g_pt,mapserver.g_port_pt,mapserver.g_sb,mapserver.g_port_sb,mapserver.g_tap,mapserver.g_port_tap,mapserver.g_dst,mapserver.g_port_dst,mapserver.g_splc,mapserver.g_port_splc,mapserver.g_rf_amp,mapserver.g_port_rf_amp,mapserver.g_ft_amp,mapserver.g_port_ft_amp/{z}/{x}/{y}.mvt?filter=f_seq_no=1`,
        minZoom: 12,
        maxZoom: 23,
        filled: true, // true
        stroked: false, // false
        extruded: true, // false
        wireframe: true, // false
        getFillColor: [60, 60, 60, 40],
        getLineWidth: 5,
        sizeUnits: 'meters',
        getLineColor: [60, 60, 60, 40],
        lineWidthMinPixels: 1,
        getLineColor: d => {
          // console.log('getcolor',d)
          const hex = d.properties.color;
          const color = hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
          return [...color, 255];
        },
        getLineWidth: d => .1,
        pointType: 'icon+text',
        iconBillboard: false,
        iconSizeUnits: 'meters',
        iconSizeScale: 1,
        getIcon: (d) => {
          // console.log('***getIcon',d.properties.name, d.properties.f_seq_no);
          try {
            const icon = require(`../../svg/${d.properties.name}.svg`).default;
            if (icon) {
              return {
                // url: `images/svg/${d.properties.name}.svg`,
                url: icon,
                width: parseInt(d.properties.width),
                height: parseInt(d.properties.height),
              };
            }
          } catch (error) {
            // console.log('error')
            // dummy
            return {
              url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dummy)}`,
              width: 24,
              height: 24,
            }
          }
        },
        getIconSize: d => d.properties.height / 100 * d.properties.mrf_attr_32 * 2,
        getIconAngle: d => parseInt(d.properties.mrf_attr_31),
        getIconColor: d => {
          // console.log('***Color',d.properties.color)
          return [255, 0, 0, 255];
        },
        // getIconPixelOffset: d => [5, 20],
        textSizeUnits: 'meters',
        textBillboard: false,
        getText: d => d.properties.mrf_attr_37,
        getTextColor: d => {
          const hex = d.properties.color;
          const color = hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
          return [...color, 255];
        },
        getTextSize: d => d.properties.mrf_attr_32 * 2,
        getTextAngle: d => {
          // console.log('angle',d.properties.mrf_attr_31)
          return parseInt(d.properties.mrf_attr_31);
        },
        pickable: true,
        // onHover: updateTooltip
        onClick: (feature, opt) => {
          console.log(feature, opt)
        },
      }),
    ]);
  } else {
    layers.push(...[
      new PathLayer({
      // new MVTLayer({
        id: `main-ms_messen`,
        data: `${API_SERV_HOST}/path/g_messen.pbf?bbox=${bbox}`,
        // data: `https://cadix-api.altlas.co.jp/feature/g_messen.pbf?bbox=${bbox}`,
        // data: `https://cadix-tile.altlas.co.jp/mapserver.g_messen/{z}/{x}/{y}.mvt`,
        // minZoom: 12,
        // maxZoom: 23,
        loaders: [PBFLoader],
        jointRounded: true,
        filled: false, // true
        stroked: true, // false
        extruded: true, // false
        wireframe: true, // false
        // getLineWidth: .1,
        getWidth: .5,
        sizeUnits: 'meters',
        lineWidthMinPixels: 1,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 0, 0, 100],
        uniqueIdProperty: 'callSign',
        // highlightedFeatureId: highlight,
        // getLinePath: d => {
        //   console.log('getLinePath1',d)
        //   return d.path;
        // },
        getPath: d => {
          const ret = d.geometry.coordinates.map(c => [...c, 6.4])
          // console.log('ret',ret)
          return ret
        },
        getColor: d => {
          // console.log('getcolor')
          const hex = d.properties.color;
          const color = hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16));
          return [...color, 100];
        },
        // getWidth: d => .5,
        onClick: (feature, event) => {
          console.log(feature, event)
          if (event.srcEvent.defaultPrevented) {
            return true;
          }
          onFeatureClick(feature, event)
          return true;
        },
      }),
      // new IconLayer({
      //   id: 'icon-layer',
      //   data: `//localhost:3001/path/g_pole.pbf?bbox=${bbox}`,
      //           loaders: [PBFLoader],

      //   pickable: true,
      //   // iconAtlas and iconMapping are required
      //   // getIcon: return a string
      //   iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      //   iconMapping: {
      //     marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
      //   },
      //   getIcon: d => 'marker',
    
      //   sizeScale: 15,
      //   getPosition: d => {
      //     console.log('icon',d)
      //     return d.geometry.coordinates
      //   },
      //   getSize: d => 5,
      //   // getColor: d => [Math.sqrt(d.exits), 140, 0]
      // }),

      // new GeoJsonLayer({
      //   id: 'hogehoge',
      //   data: `//localhost:3001/path/g_pole.pbf?bbox=${bbox}`,
      //   loaders: [PBFLoader],
      //   _subLayerProps: {
      //     points: {
      //       type: ScenegraphLayer,
      //       scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
      //       getPosition: d => {
      //         console.log('getPosition',d)
      //         return d.coordinates
      //       },
      //       getOrientation: d => [0, Math.random() * 180, 90],
      //       _animations: {
      //         '*': {speed: 5}
      //       },
      //       sizeScale: 1,
      //       _lighting: 'pbr'
      //     },
      //   },
      //   // renderSubLayers: props => {
      //   //   console.log('props',props)
      //   //   const {tile} = props;
      //   //   console.log('aaaa',tile.dataInWGS84)
      //   //   const data = tile.dataInWGS84.map(feature => {
      //   //     const coordinates = feature.geometry.coordinates;
      //   //     // console.log('feature', feature)
      //   //     return {
      //   //       "id": 1,
      //   //       "name": "aaa",
      //   //       "coordinates": coordinates,
      //   //     }
      //   //   })

      //   //   // console.log('data', data)
      //   //   return new ScenegraphLayer({
      //   //     // id: 'scenegraph-layer',
      //   //     id: props.id,
      //   //     data,
      //   //     pickable: true,
      //   //     scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
      //   //     getPosition: d => {
      //   //       // console.log('getPosition',d)
      //   //       return d.coordinates
      //   //     },
      //   //     getOrientation: d => [0, Math.random() * 180, 90],
      //   //     _animations: {
      //   //       '*': {speed: 5}
      //   //     },
      //   //     sizeScale: 1,
      //   //     _lighting: 'pbr'
      //   //   })
      //   // },
      // }),

      new ScenegraphLayer({
        id: 'main-scenegraph-layer-krpano',
        data: `${API_SERV_HOST}/func/facilityonmessen.pbf?bbox=${bbox}`,
        loaders: [PBFLoader, GLTFLoader],
        pickable: true,
        // scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
        scenegraph: '/gltf/onmessen.glb',
        getPosition: d => {
          // console.log('getPosition',d.geometry.coordinates)
          return [...d.geometry.coordinates, 6.5]
        },
        // getPosition: d => {
        //   console.log('getPosition',d.coordinates)
        //   return d.coordinates
        // },
        getOrientation: d => [0, 360 - d.properties.angle + 90, 90],
        // _animations: {
        //   '*': {speed: 5}
        // },
        sizeScale: 1.5,
        highlightColor: [255, 0, 0, 100],
        _lighting: 'pbr',
        onClick: (feature, event) => {
          if (event.srcEvent.defaultPrevented) {
            return true;
          }
          onFeatureClick(feature, event)
          return true;
        }
      }),

      new MVTLayer({
        id: 'main-ms_pole',
        data: `${TILE_SERV_HOST}/mapserver.g_pole_polygon/{z}/{x}/{y}.mvt`,
        binary: false,
        minZoom: 12,
        maxZoom: 23,
        filled: true, // true
        stroked: false, // false
        extruded: true, // false
        wireframe: true, // false
        getFillColor: [60, 60, 60, 40],
        getLineWidth: 5,
        sizeUnits: 'meters',
        getLineColor: [60, 60, 60, 40],
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
      }),
    ]);

    if (isPlateau) {
      layers.push(
        //建物データ(mvt)を読み込んで表示するレイヤ
        new MVTLayer({
          id: "main-plateau",
          data: `https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf`,
          minZoom: 0,
          maxZoom: 16,
          getFillColor: [0, 255, 0, 255],
          lineWidthMinPixels: 1,
          pickable: true,
          extruded: true, //押出をonにする
          autoHighlight: true,
          highlightColor: [255, 0, 0],
          getElevation: (d) => d.properties.measuredHeight,
          wireframe: true, //lineを有効にする
          lineWidthMinPixels: 1,
          getLineColor: [0, 0, 0],
          material: {
            //立体ポリゴンのマテリアルを設定
            ambient: 0.1,
            diffuse: 0.9,
            shininess: 32,
            specularColor: [30, 30, 30]
          }
        }),
      );
    }
  }

  // layers.push(...createMinimapLayer(viewState));
  
  return layers;
}

const createMinimapLayer = (viewState) => {
  const {width, height} = viewState.main;
  if (!width) return null;
  const viewport = new WebMercatorViewport(viewState.main);

  const topLeft = viewport.unproject([0, 0]);
  const topRight = viewport.unproject([width, 0]);
  const bottomLeft = viewport.unproject([0, height]);
  const bottomRight = viewport.unproject([width, height]);

  return [
    new MVTLayer({
      id: 'minimap-ms_pole',
      data: `${TILE_SERV_HOST}/mapserver.g_pole/{z}/{x}/{y}.mvt`,
      minZoom: 12,
      maxZoom: 23,
      filled: true, // true
      stroked: false, // false
      extruded: true, // false
      wireframe: true, // false
      getFillColor: [255, 255, 100, 100],
      getLineColor: [255, 255, 100, 100],
      getLineWidth: 5,
      getPointRadius: 2,
      sizeUnits: 'meters',
      lineWidthMinPixels: 1,
      pickable: true,
      // onHover: updateTooltip
      onClick: (feature, opt) => {
        console.log(feature, opt)
      },
    }),
    new MVTLayer({
      id: 'minimap-ms_messen',
      data: `${TILE_SERV_HOST}/mapserver.g_messen/{z}/{x}/{y}.mvt`,
      minZoom: 12,
      maxZoom: 23,
      filled: true, // true
      stroked: false, // false
      extruded: true, // false
      wireframe: true, // false
      getFillColor: [60, 60, 60, 100],
      getLineWidth: 2,
      sizeUnits: 'meters',
      getLineColor: d => {
        const hex = d.properties.color;
        return hex.match(/[0-9a-f]{2}/ig).map(x => parseInt(x, 16))
      },
      lineWidthMinPixels: 1,
      pickable: true,
      // onHover: updateTooltip
      onClick: (feature, opt) => {
        console.log(feature, opt)
      },
    }),
    new PathLayer({
      id: 'minimap-viewport-bounds',
      data: [[topLeft, topRight, bottomRight, bottomLeft, topLeft]],
      getPath: d => d,
      getColor: [255, 0, 0],
      getWidth: 2,
      widthUnits: 'pixels'
    }),
  ];
}