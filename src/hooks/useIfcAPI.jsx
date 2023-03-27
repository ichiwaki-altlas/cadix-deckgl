import create from "zustand";

export default create((set) => ({
  ifcAPI: false,
  setIfcAPI: (api) => {
    set(() => {
      return { ifcAPI: api };
    });
  },
}));