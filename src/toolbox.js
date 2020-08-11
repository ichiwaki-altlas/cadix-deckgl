import * as React from 'react';
import * as Mode from '@nebula.gl/edit-modes';
import styled from 'styled-components';

const Tools = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 10px;
  right: 10px;
`;

const Button = styled.span`
  color: #fff;
  background-color: rgb(90, 98, 94);
  font-size: 1em;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  border: 1px solid transparent;
  border-radius: 0.25em;
  margin: 0.05em;
  padding: 0.1em 0.2em;
`;

// export type Props = {
//   mode: any;
//   features: any;
//   onSetMode: (arg0: any) => unknown;
//   onImport: (arg0: any) => unknown;
// };

const MODE_BUTTONS = [
  // TODO: change these to icons
  { mode: Mode.ViewMode, content: 'View' },
  { mode: Mode.GeoJsonEditMode, content: 'GeoJsonEditMode' },
  { mode: Mode.ModifyMode, content: 'ModifyMode' },
  { mode: Mode.TranslateMode, content: 'TranslateMode' },
  { mode: Mode.ScaleMode, content: 'ScaleMode' },
  { mode: Mode.RotateMode, content: 'RotateMode' },
  { mode: Mode.DuplicateMode, content: 'DuplicateMode' },
  { mode: Mode.ExtendLineStringMode, content: 'ExtendLineStringMode' },
  { mode: Mode.SplitPolygonMode, content: 'SplitPolygonMode' },
  { mode: Mode.ExtrudeMode, content: 'ExtrudeMode' },
  { mode: Mode.ElevationMode, content: 'ElevationMode' },
  { mode: Mode.TransformMode, content: 'TransformMode' },
  { mode: Mode.DrawPointMode, content: 'DrawPointMode' },
  { mode: Mode.DrawLineStringMode, content: 'DrawLineStringMode' },
  { mode: Mode.DrawPolygonMode, content: 'DrawPolygonMode' },
  { mode: Mode.DrawRectangleMode, content: 'DrawRectangleMode' },
  { mode: Mode.DrawCircleByDiameterMode, content: 'DrawCircleByDiameterMode' },
  { mode: Mode.DrawCircleFromCenterMode, content: 'DrawCircleFromCenterMode' },
  { mode: Mode.DrawEllipseByBoundingBoxMode, content: 'DrawEllipseByBoundingBoxMode' },
  { mode: Mode.DrawEllipseUsingThreePointsMode, content: 'DrawEllipseUsingThreePointsMode' },
  { mode: Mode.DrawRectangleUsingThreePointsMode, content: 'DrawRectangleUsingThreePointsMode' },
  { mode: Mode.Draw90DegreePolygonMode, content: 'Draw90DegreePolygonMode' },
  { mode: Mode.DrawPolygonByDraggingMode, content: 'DrawPolygonByDraggingMode' },
  { mode: Mode.MeasureDistanceMode, content: 'MeasureDistanceMode' },
  { mode: Mode.MeasureAreaMode, content: 'MeasureAreaMode' },
  { mode: Mode.MeasureAngleMode, content: 'MeasureAngleMode' },
  { mode: Mode.CompositeMode, content: 'CompositeMode' },
  { mode: Mode.SnappableMode, content: 'SnappableMode' },
];

export function Toolbox(props) {
  // Initialize to zero index on load as nothing is active.
  const [showImport, setShowImport] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);

  return (
    <>
      <Tools>
        {MODE_BUTTONS.map((modeButton, i) => (
          <Button
            key={i}
            style={{
              backgroundColor:
                props.mode === modeButton.mode ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
            }}
            onClick={() => {
              props.onSetMode(() => modeButton.mode);
            }}
          >
            {modeButton.content}
          </Button>
        ))}
      </Tools>
    </>
  );
}
