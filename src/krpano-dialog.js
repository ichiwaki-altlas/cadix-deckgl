import React, {useCallback,useEffect, useState, forwardRef} from 'react';
import { styled } from "@mui/system";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import Slide from '@mui/material/Slide';
import { Hotspot, Krpano, Scene, SceneProps, View, Layer } from '@0xllllh/react-krpano';
import { DeleteOutline, EditOutlined, MoreVertOutlined, SaveOutlined } from '../node_modules/@mui/icons-material/index';
import { ToggleButton, ToggleButtonGroup } from '../node_modules/@mui/material/index';
import KrpanoAttribute from './components/krpano-attribute';

const MODE = Object.freeze({
  NONE: Symbol(0),
  ADD : Symbol(1),
  DELETE : Symbol(2),
  MOVE : Symbol(3),
  ATTRIBUTE: Symbol(4),
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function KrpanoDialog(props) {
  const { onClose, open } = props;
  const [hotspots, setHotspots] = useState([{
    name: `hotspot0`,
    ath: 48.5,
    atv: -21,
    // url: "hotspot.png",
    style: "hotspot_ani_white",
    // onclick: handleHotspotClick,
  }]);
  const [renderer, setRenderer] = useState(null);
  const [mode, setMode] = useState(MODE.NONE);
  const [isInitialized, setInitialized] = useState(false);
  const [isAttributePanelOpen, setAttributePanelOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [currentScene, setCurrentScene] = useState('scene0');

  const onAddHotspot = useCallback(() => {
    setHotspots([
      ...hotspots, {
        name: `hotspot${hotspots.length}`,
        ath: renderer?.get('view.hlookat') || 0,
        atv: renderer?.get('view.vlookat') || 0,
        style: 'hotspot-style',
        // ondown: 'draghotspot()',
        onclick: handleHotspotClick,
      },
    ]);
  }, [hotspots, renderer]);

  const onFileInputChange = (event) => {
    event.preventDefault()
    const reader = new FileReader()
    const file = event.target.files[0]
    reader.onloadend = () => {
      console.log("onloadend!", reader.result);
      var _krpano = renderer.krpanoRenderer.get("global");
      _krpano.image.reset();
      _krpano.image.sphere = {
        url : reader.result,
        // multires : "512,1024x512,2048x1024,4096x2048"
      }
      _krpano.actions.loadpanoimage('MERGE','BLEND(0.5)', () => {
        console.log('load call done');
        setInitialized(true);
      });
    }
    reader.readAsDataURL(file)

    event.target.value = "";
  };

  useEffect(() => {
    if (renderer == null) {
      return;
    }

    var _krpano =renderer.krpanoRenderer.get("global");
    const hotspotCount = _krpano.get('hotspot.count');
    const hotspots = Array(hotspotCount).fill().map((_, index) => _krpano.get(`hotspot[${index}]`));

    // init
    hotspots.forEach((hs) => {
      // renderer.krpanoRenderer.onclick = null;
      delete hs.onclick;
      delete hs.ondown;
    });

    if (mode === MODE.ADD) {
        const hs = _krpano.addhotspot();
        hs.url = "hotspot.png";
        hs.ath = renderer?.get('view.hlookat');
        hs.atv = renderer?.get('view.vlookat');

        // const layer = _krpano.addlayer();
        // console.log('layer', layer)
        // layer.type = "container";
        // layer.width = 250;
        // layer.height = 250;
        // layer.bgcolor = "0xFF0000";
        // layer.bgalpha = "0.5";
        // layer.bgcapture = "true";
        // layer.x = renderer?.get('view.hlookat');
        // layer.y = renderer?.get('view.vlookat');

        setMode(MODE.NONE);
      // }
    } else if (mode === MODE.DELETE) {
        hotspots.forEach((hs) => {
        hs.onclick = () => {
          _krpano.removehotspot(hs.name);
        }
      });
    } else if (mode === MODE.MOVE) {
      hotspots.forEach((hs) => {
        hs.ondown = 'draghotspot()';
      });
    } else if (mode === MODE.ATTRIBUTE) {
      hotspots.forEach((hs) => {
        hs.onclick = () => {
          console.log('attribute click')
          setAttributePanelOpen(true);
          setSelectedHotspot(hs);
        };
      });
    }
  }, [mode]);

  // useEffect(() => {
  //   console.log('init', document.getElementById('btnbtn'));
  //   embedpano({target: "pano", html5:"only", xml:"krpano/tour.xml", onready:function(krpano)　{
  //     console.log('onready')
  //     // krpano = krpano.get("global");
      
  //     // krpano.view.hlookat = 40;
  //     // krpano.view.vlookat = 30;
  //     // krpano.view.fov = 120;
  //     // krpano.actions.loadpano('image.xml',null,'MERGE|KEEPVIEW');
  //     // var hs = krpano.addhotspot();
  //     // hs.url = "spot.png";
  //     // hs.ath = 123.4;
  //     // hs.atv = 12.3;
  //     // hs.onclick = function()
  //     // {
  //     //     krpano.actions.loadpano('pano2.xml',null,'MERGE','BLEND(0.5)');
  //     // }
  //   }});
  // }, [])

  const handleClose = () => {
    setInitialized(false);
    onClose();
  }

  const handleSetClick = (hs, name) => {
    console.log('name', name);
    var _krpano =renderer.krpanoRenderer.get("global");
    const text = _krpano.addhotspot();
    text.type = "text";
    text.html = name;
    text.css = "font-family:Arial; font-size:20px; color:#000000;";
    text.ath = hs.ath;
    text.atv = hs.atv + 4;

    setSelectedHotspot(null);
  }

  const handleAdd = () => {
    renderer.call("screentosphere(mouse.x, mouse.y, mouseath, mouseatv);");

    const mouse_at_h = renderer.get("mouseath");
    const mouse_at_v = renderer.get("mouseatv");
    console.log('***',mouse_at_h);
    console.log('***', renderer?.get('view.hlookat'))
    console.log('***',mouse_at_v);
    console.log('***', renderer?.get('view.vlookat'))

    const spotname = "spot123";
    
    // var hs = krpano.addHotspot(spotname, {
    //   url: "circle.png",
    //   ath: mouse_at_h,
    //   atv: mouse_at_v,
    //   scale: 0.7,
    //   zoom: true,
    //   ondown: 'draghotspot()',
    //   onclick: 'js(jsTest())'
    // });

    // var str = `
    //   addhotspot(${spotname});
    //   set(hotspot[${spotname}].url, circle.png);
    //   set(hotspot[${spotname}].ath, ${mouse_at_h});
    //   set(hotspot[${spotname}].atv, ${mouse_at_v});
    //   set(hotspot[${spotname}].scale, 0.7);
    //   set(hotspot[${spotname}].zoom, true);
    //   set(hotspot[${spotname}].ondown, draghotspot());
    // `;
    // // str += "set(hotspot[" + spotname + "].onhover,showtext(Name of the Hostpot));";
    // str += "set(hotspot[" + spotname + "].ondown,draghotspot();";
    // krpano.call(str);

    var _krpano =renderer.krpanoRenderer.get("global");
    console.log("*** _krpano",_krpano)
    var hs = _krpano.addhotspot();
    // hs.style = "hotspot-style";
    hs.url ="hotspot.png";
    hs.ath = renderer?.get('view.hlookat'),
    hs.atv = renderer?.get('view.vlookat'),
    // hs.scale = 0.7;
    // hs.zoom = true;
    // hs.ondown = 'draghotspot()';
    hs.onclick = function(e) {
      console.log('onclick',e)
    }
    console.log('hs',hs)
  };

  const handleModeChange = (event, mode) => {
    setMode(mode);
  }

  const handleHotspotClick = () => {
    console.log('click')
    const _krpano = renderer.krpanoRenderer.get("global");
    _krpano.actions.loadscene('scene1', null, 'MERGE','BLEND(0.5)', () => {
      // console.log('loadscene');
      // const hs = _krpano.addhotspot();
      // hs.url = "hotspot.png";
      // hs.ath = -150;
      // hs.atv = 25;
      // hs.onclick = () => {
      //   _krpano.actions.loadscene('scene0', null, 'MERGE','BLEND(0.5)');
      // }
    });

  }

  const scenes = [{
    name: 'scene0',
    images: [{
      type: 'sphere',
      url: '/krpano/IMG_0095.JPG',
    }],
    hotspots: [{
      name: "hotspot0",
      ath: 188,
      atv: -35,
      style: "hotspot_ani_white",
      onclick: () => setCurrentScene('scene1')
    }]
  }, {
    name: 'scene1',
    images: [{
      type: 'sphere',
      url: '/krpano/R0010026.JPG',
    }],
    hotspots: [{
      name: "hotspot1",
      ath: -150,
      atv: 25,
      style: "hotspot_ani_white",
      onclick: () => setCurrentScene('scene0')
    }]
  }];

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
          <span style={{marginLeft: "auto", marginRight: -12}}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              style={{backgroundColor: '#fff'}}
            >
              <ToggleButton value={MODE.ADD} aria-label="left aligned">
                <AddCircleOutlineIcon />
                <Typography sx={{ ml: 1 }}>追加</Typography>
              </ToggleButton>
              <ToggleButton value={MODE.DELETE} aria-label="centered">
                <DeleteOutline />
                <Typography sx={{ ml: 1 }}>削除</Typography>
              </ToggleButton>
              <ToggleButton value={MODE.MOVE} aria-label="right aligned">
                <OpenWithIcon />
                <Typography sx={{ ml: 1 }}>移動</Typography>
              </ToggleButton>
              <ToggleButton value={MODE.ATTRIBUTE} aria-label="right aligned">
                <OpenWithIcon />
                <Typography sx={{ ml: 1 }}>属性</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </span>
        </Toolbar>
      </AppBar>
      <Krpano currentScene={currentScene} xml="krpano/test.xml" onReady={setRenderer}>
        {scenes.map(sc => (
          <Scene {...sc}>
            {sc.hotspots.map(hs => <Hotspot {...hs} />)}
          </Scene>
        ))}
      </Krpano>
      <Slide direction="left" in={!!selectedHotspot} mountOnEnter unmountOnExit>
        {/* <div style={{backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, height: 200}}> */}
        <div style={{backgroundColor: 'white', position: 'absolute', top: 72, right: 8}}>
          <KrpanoAttribute hotspot={selectedHotspot} onSetClick={handleSetClick} />
        </div>
      </Slide>
    </Dialog>
  );
}
