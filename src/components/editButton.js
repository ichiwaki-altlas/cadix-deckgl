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
})

const EditButton = ({onClick}) => {

  return (
    <Button onClick={onClick}>
      平面
    </Button>
  );
}

export default EditButton;