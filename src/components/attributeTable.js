import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const AttributeTable = ({feature, onEditClick}) => {
  const _keys = feature ? Object.keys(feature.object.properties) : [];
  const keys = _keys.filter(key => key !== 'the_geom' && key !== 'path')

  console.log('feature:',feature)
  return (
    <TableContainer component={Paper} style={{maxHeight: 'calc(100vh - 16px)', maxWidth: 400}}>
      <Table stickyHeader sx aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} style={{textAlign: "right"}}>
              <Button variant="contained" onClick={onEditClick}>図形編集</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{width: 200}}>属性名</TableCell>
            <TableCell style={{width: 200}} align="right">値</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell style={{width: 200, maxWidth: 200, textOverflow: 'ellipsis'}} component="th" scope="row">{key}</TableCell>
              <TableCell style={{width: 200, maxWidth: 200, textOverflow: 'ellipsis'}} align="right">{feature.object.properties[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttributeTable;