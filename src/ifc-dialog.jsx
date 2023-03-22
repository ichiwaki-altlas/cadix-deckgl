import React, {useCallback,useEffect, useState, forwardRef} from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Experience from './ifc/experience';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function IFCDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
          background: "#f0f8ff",
        }}
        camera={{
          fov: 75,
          near: 0.1,
          far: 200,
          position: [10, 4, 10],
        }}
      >
        <Experience />
      </Canvas>
    </Dialog>
  );
}
