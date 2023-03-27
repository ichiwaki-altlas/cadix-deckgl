import { IFCLoader } from "web-ifc-three";
import create from "zustand";

export default create((set) => ({
  loaded: false,
  setLoaded: (flg) => {
    set(() => {
      return { loaded: flg };
    });
  },
  loader: null,
  setLoader: (loader) => {
    set(() => {
      return { loader: loader };
    });
  },
}));