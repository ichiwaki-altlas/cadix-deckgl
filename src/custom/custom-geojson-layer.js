import {GeoJsonLayer} from '@deck.gl/layers';
import {
  POINT_LAYER,
  LINE_LAYER,
  POLYGON_LAYER,
  getDefaultProps,
  forwardProps,
} from './sub-layer-map';
// import {BinaryFeatureTypes, binaryToFeatureForAccesor} from './geojson-binary';

const defaultProps = {
  ...getDefaultProps(POINT_LAYER.circle),
  ...getDefaultProps(POINT_LAYER.icon),
  ...getDefaultProps(POINT_LAYER.text),
  ...getDefaultProps(LINE_LAYER),
  ...getDefaultProps(POLYGON_LAYER),

  // Overwrite sub layer defaults
  stroked: true,
  filled: true,
  extruded: false,
  wireframe: false,
  iconAtlas: {type: 'object', value: null},
  iconMapping: {type: 'object', value: {}},
  getIcon: {type: 'accessor', value: f => f.properties.icon},
  getText: {type: 'accessor', value: f => f.properties.text},

  // Self props
  pointType: 'circle',

  // TODO: deprecated, remove in v9
  getRadius: {deprecatedFor: 'getPointRadius'}
};

// type GeoJsonPickingInfo = PickingInfo & {
//   featureType?: string | null;
//   info?: any;
// };

export default class CustomGeoJsonLayer extends GeoJsonLayer {
  // static layerName = 'CustomGeoJsonLayer';
  // static defaultProps = defaultProps;

  _renderLineLayers() {
    const {extruded, stroked} = this.props;
    const {layerProps} = this.state;
    const polygonStrokeLayerId = 'polygons-stroke';
    const lineStringsLayerId = 'linestrings';

    const PolygonStrokeLayer =
      !extruded &&
      stroked &&
      this.shouldRenderSubLayer(polygonStrokeLayerId, layerProps.polygonsOutline.data) &&
      this.getSubLayerClass(polygonStrokeLayerId, LINE_LAYER.type);
    const LineStringsLayer =
      this.shouldRenderSubLayer(lineStringsLayerId, layerProps.lines.data) &&
      this.getSubLayerClass(lineStringsLayerId, LINE_LAYER.type);

      console.log('layerProps.lines::1',layerProps.lines)
      // delete layerProps.lines.data.attributes;
      // layerProps.lines._pathType = null;
      console.log('layerProps.lines::2',layerProps.lines)

    if (PolygonStrokeLayer || LineStringsLayer) {
      const forwardedProps = forwardProps(this, LINE_LAYER.props);

      console.log('forwardedProps',this,forwardedProps)
      console.log('LineStringsLayer',LineStringsLayer)
      console.log('sublayer props', this.getSubLayerProps({
        id: lineStringsLayerId,
        updateTriggers: forwardedProps.updateTriggers
      }))
      return [
        PolygonStrokeLayer &&
          new PolygonStrokeLayer(
            forwardedProps,
            this.getSubLayerProps({
              id: polygonStrokeLayerId,
              updateTriggers: forwardedProps.updateTriggers
            }),
            layerProps.polygonsOutline
          ),

        LineStringsLayer &&
          new LineStringsLayer(
            forwardedProps,
            this.getSubLayerProps({
              id: lineStringsLayerId,
              updateTriggers: forwardedProps.updateTriggers
            }),
            layerProps.lines,
            // {_pathType: null}
          )
      ];
    }
    return null;
  }

  getSubLayerAccessor = (accessor) => {
    const {binary} = this.state;
    if (!binary || typeof accessor !== 'function') {
      console.log('accessor1',accessor)
      return super.getSubLayerAccessor(accessor);
    }

    return (object, info) => {
      const {data, index} = info;
      const feature = binaryToFeatureForAccesor(data, index);
      // @ts-ignore (TS2349) accessor is always function
      console.log('accessor2',accessor)
      return accessor(feature, info);
    };
  }
}

export function binaryToFeatureForAccesor(
  data,
  index
) {
  if (!data) {
    return null;
  }

  const featureIndex = 'startIndices' in data ? data.startIndices[index] : index;
  const geometryIndex = data.featureIds.value[featureIndex];

  if (featureIndex !== -1) {
    return getPropertiesForIndex(data, geometryIndex, featureIndex);
  }

  return null;
}

function getPropertiesForIndex(
  data,
  propertiesIndex,
  numericPropsIndex
) {
  const feature = {
    properties: {...data.properties[propertiesIndex]}
  };

  for (const prop in data.numericProps) {
    feature.properties[prop] = data.numericProps[prop].value[numericPropsIndex];
  }

  return feature;
}

CustomGeoJsonLayer.layerName = 'CustomGeoJsonLayer';
CustomGeoJsonLayer.defaultProps = defaultProps;