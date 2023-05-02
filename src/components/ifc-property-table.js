import React from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import ReactJson from 'react-json-view'

const IfcPropertyTable = ({property}) => {
  return (
    <Container component={Paper} style={{
      maxHeight: 'calc(100vh - 80px)',
      maxWidth: 400,
      overflow: 'auto',
    }}>
      <ReactJson src={property} />
    </Container>
  );
}

export default IfcPropertyTable;