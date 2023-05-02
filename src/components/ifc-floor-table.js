import React, { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useViewerContext } from '../ifc/ifc-viewer';

const IfcFloorTable = () => {
  const viewer = useViewerContext()
  const [floors, setFloors] = useState([])
  console.log('viewer:',viewer)

  useEffect(() => {
    if (!viewer) {
      return;
    }
  
    const models = viewer.context.items.ifcModels;
    if (models.length === 0) {
      return;
    }

    (async () => {
      // it use first model
      const firstModel = models[0];
      await viewer.plans.computeAllPlanViews(firstModel.modelID);
      const planes = viewer.plans.planLists[firstModel.modelID];
      console.log('***planes',planes)
      const floors = planes ? Object.values(planes) : [];
      setFloors(floors)

      console.log('floors',floors)
    })()

    window.onkeydown = handleKeydown
  }, [viewer])

  const handleKeydown = (event) => {
    console.log('handleKeydown', event.code)
    if (event.code === 'Escape') {
      viewer.plans.exitPlanView(true);
      viewer.edges.toggle('0');
      // viewer.shadowDropper.shadows[0].root.visible = true;
      // viewer.filler.fills[0].visible = true;
    }
  };

  const handleFloorItemClick = async (floor) => {
    console.log('handleFloorItemClick', floor)
    const models = viewer.context.items.ifcModels;
    if (models.length === 0) return;

    // it use first model
    const firstModel = models[0];
    await viewer.plans.goTo(firstModel.modelID, floor.expressID, true);
    console.log('viewer.plans.active', viewer.plans.active)
    // viewer.plans.active = false
    // viewer.context.items.ifcModels.forEach(
    //     (model) => viewer.edges.toggle(`${model.modelID}`));
    // viewer.shadowDropper.shadows[0].root.visible = false;
    // viewer.filler.fills[0].visible = false;
  }

  return (
    <TableContainer component={Paper} style={{maxHeight: 'calc(100vh - 16px)', maxWidth: 400}}>
      <Table stickyHeader aria-label="simple table">
        <TableBody>
          {floors.map((floor) => (
            <TableRow
              key={floor.expressID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                style={{width: 200, maxWidth: 200, textOverflow: 'ellipsis'}}
                component="th"
                scope="row"
                onClick={() => handleFloorItemClick(floor)}
              >
                {floor.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IfcFloorTable;