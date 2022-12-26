import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import { styled } from "@mui/system";

const ContextMenuWrapper = styled('Paper')({
//   display: 'inline-block',
//   borderRadius: '3px',
//   padding: '0.5rem 0',
//   margin: '0.5rem 1rem',
  background: 'white',
  border: '2px solid grey',
  position: 'absolute',
  borderRadius: "2px",
  padding: "5px 0 5px 0",
  margin: 0,
  listStyle: "none",
  boxShadow: "0 0 20px 0 #ccc",
  opacity: 1,
  transition: "opacity 0.5s linear",
})

export default function ContextMenu({top, left, onAddPanorama}) {
  return (
    <ContextMenuWrapper sx={{ width: 320, maxWidth: '100%' }} style={{top, left}}>
      <MenuList>
        <MenuItem onClick={onAddPanorama}>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>パノラマビューを追加</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘X
          </Typography>
        </MenuItem>
      </MenuList>
    </ContextMenuWrapper>
  );
}