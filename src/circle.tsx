import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PI = 3.1415926;
const CONVERT_COEFFICIENT = 2 * PI / 360;

interface Props {
  radius: number,
  intervals: Array<AnglesDescriptor>,
  width: number,
  color: string,
  backgroundColor: string,
}

interface Point {
  x: number,
  y: number,
}

interface AnglesDescriptor {
  start: number,
  end: number,
}

interface DayEnergyPoints {
  start: Point,
  end: Point,
  middle?: Point,
}

const getPointByAngle = (center: Point, radius: number, angle: number): Point => {
  return {
    x: center.x + Math.sin(angle * CONVERT_COEFFICIENT) * radius,
    y: center.y - Math.cos(angle * CONVERT_COEFFICIENT) * radius,
  }
};

const getPointsByDescriptor = (angles: AnglesDescriptor, center: Point, radius: number): DayEnergyPoints => {
  const start = getPointByAngle(center, radius, angles.start);
  const end = getPointByAngle(center, radius, angles.end);
  if (angles.end - angles.start > 180) {
    const middle = getPointByAngle(center, radius, angles.start + 180);
    return {
      start,
      end,
      middle
    }
  }
  return {
    start,
    end,
  };
}

const MultiArcCircle = ({
  radius,
  intervals,
  color,
  backgroundColor,
  width
}: Props) => {
  const EDGE_RADIUS = width / 2;
  const internalRadius = radius - width;
  const center = { x: radius, y: radius };

  const paths = intervals.map(angles => {
    const { start: startPoint, end: endPoint, middle: middlePoint }
      = getPointsByDescriptor(angles, center, radius);
    const { start: startPointInternal, end: endPointInternal, middle: middlePointInternal }
      = getPointsByDescriptor(angles, center, internalRadius);

    return angles.end - angles.start <= 180 ?
      <Path key={`${angles.start}.${angles.end}`} d={`M ${startPoint.x} ${startPoint.y} 
        A ${radius} ${radius} , 0, 0, 1, ${endPoint.x} ${endPoint.y}
        A ${EDGE_RADIUS} ${EDGE_RADIUS} , 0, 0, 1, ${endPointInternal.x} ${endPointInternal.y}
        A ${internalRadius} ${internalRadius} , 0, 0, 0, ${startPointInternal.x} ${startPointInternal.y}
        A ${EDGE_RADIUS} ${EDGE_RADIUS} , 0, 0, 1, ${startPoint.x} ${startPoint.y}
      `}
        fill={color}
      />
      :
      <Path key={`${angles.start}.${angles.end}`} d={`M ${startPoint.x} ${startPoint.y} 
        A ${radius} ${radius} , 0, 0, 1, ${middlePoint && middlePoint.x} ${middlePoint && middlePoint.y}
        A ${radius} ${radius} , 0, 0, 1, ${endPoint.x} ${endPoint.y}
        A ${EDGE_RADIUS} ${EDGE_RADIUS} , 0, 0, 1, ${endPointInternal.x} ${endPointInternal.y}
        A ${internalRadius} ${internalRadius} , 0, 0, 0, ${middlePointInternal && middlePointInternal.x} ${middlePointInternal && middlePointInternal.y}
        A ${internalRadius} ${internalRadius} , 0, 0, 0, ${startPointInternal.x} ${startPointInternal.y}
        A ${EDGE_RADIUS} ${EDGE_RADIUS} , 0, 0, 1, ${startPoint.x} ${startPoint.y}
      `}
        fill={color}
      />
  })

  const { start: startPoint, end: endPoint }
    = getPointsByDescriptor({ start: 0, end: 180 }, center, radius);
  const { start: startPointInternal, end: endPointInternal }
    = getPointsByDescriptor({ start: 0, end: 180 }, center, internalRadius);

  return (
    <Svg style={{
      position: 'absolute',
      borderRadius: radius,
    }} width={radius * 2} height={radius * 2}>
      <Path d={`M ${startPoint.x} ${startPoint.y} 
    A ${radius} ${radius} , 0, 0, 1, ${endPoint.x} ${endPoint.y}
    L ${endPointInternal.x} ${endPointInternal.y}
    A ${internalRadius} ${internalRadius} , 0, 0, 0, ${startPointInternal.x} ${startPointInternal.y}
    L ${startPoint.x} ${startPoint.y} 

    A ${radius} ${radius} , 0, 0, 0, ${endPoint.x} ${endPoint.y}
    L ${endPointInternal.x} ${endPointInternal.y}
    A ${internalRadius} ${internalRadius} , 0, 0, 1, ${startPointInternal.x} ${startPointInternal.y}
    L ${startPoint.x} ${startPoint.y} 
    `}
        fill={backgroundColor}
      />
      {paths}
    </Svg>
  )
}

export { MultiArcCircle };