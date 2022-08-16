import {MVTWorkerLoader} from '@loaders.gl/mvt';
import Pbf from 'pbf';
import geobuf from 'geobuf'

export const PBFLoader = {
  // name: 'PBF',
  // id: 'pbf',
  // module: 'pbf',
  extensions: ['mvt', 'pbf'],
  // mimeTypes: [
  //   'application/vnd.mapbox-vector-tile',
  //   'application/x-protobuf'
  // ],
  worker: false,
  // category: 'geometry',
  parse: async (arrayBuffer, options) => parsePBF(arrayBuffer, options),
  parseSync: parsePBF,
  binary: true,
};

const parsePBF = (arrayBuffer, options) => {
  const geojson = geobuf.decode(new Pbf(arrayBuffer));
  const paths = geojson.features.map(f => {
    return {
        ...f.properties,
        path: [...f.geometry.coordinates.map(c => [...c, 6.4])],
    }
  })
  // console.log('parsePBF',paths)
  return paths;
}