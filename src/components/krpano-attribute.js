import React, {useCallback,useEffect, useState, forwardRef} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Box, TextField } from '../../node_modules/@mui/material/index';

const KrpanoAttribute = ({hotspot, onSetClick}) => {
  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  }

  console.log('hotspot:',hotspot)
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TableContainer component={Paper} style={{maxHeight: 'calc(100vh - 16px)', maxWidth: 400}}>
      <Table stickyHeader sx aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{textAlign: "right"}}>
              <Button variant="contained" onClick={() => onSetClick(hotspot, name)}>セット</Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell style={{width: 400, maxWidth: 400, textOverflow: 'ellipsis'}} align="right">
              <TextField
                required
                id="outlined-required"
                label="Required"
                onChange={handleChange}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}

export default KrpanoAttribute;