import React, {useCallback} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from "@mui/system";

const Button = styled('button')({
  display: 'inline-block',
  borderRadius: '3px',
  padding: '0.5rem 0',
  margin: '0.5rem 1rem',
  width: '11rem',
  background: 'grey',
  color: 'white',
  border: '2px solid red',
  position: 'absolute',
  right: 0,
  cursor:'pointer',
})

const EditButton = ({label, onClick, style}) => {

  return (
    <Button onClick={onClick} style={{...style}}>
      {label}
    </Button>
  );
}

export default EditButton;