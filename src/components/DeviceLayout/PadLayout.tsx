import React from 'react';
import AspectRatio from 'react-aspect-ratio';

import { Color } from '../../driver-types';

type PropTypes = {
  onClick: (event: React.MouseEvent, id: string) => void;
  id: string;
  shape: string | undefined;
  color: Color | undefined;
  width: string;
  height: string;
  enabled: boolean;
  focus: boolean;
};

function RectPad(props: PropTypes) {
  const { shape, width, height, onClick, enabled, focus, color, id } = props;

  return (
    <div
      className={`pad ${focus ? 'focus' : ''} ${enabled ? 'hoverable' : ''}`}
      onMouseDown={(event) => {
        onClick(event, id);
      }}
      style={{
        width,
        height,
        animationName: color?.modifier,
        backgroundColor: color?.string,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      aria-label={`pad ${id}`}
    />
  );
}

function SquarePad(props: PropTypes) {
  const { shape, width, height, onClick, enabled, focus, color, id } = props;

  return (
    <div
      className={`pad ${focus ? 'focus' : ''} ${enabled ? 'hoverable' : ''}`}
      onMouseDown={(event) => {
        onClick(event, id);
      }}
      style={{
        width,
        paddingBottom: width,
        animationName: color?.modifier,
        backgroundColor: color?.string,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      aria-label={`pad ${id}`}
    />
  );
}

export default function Pad(props: PropTypes) {
  const { shape, width, height, onClick, enabled, focus, color, id } = props;
  const Element = shape === 'rect' ? RectPad : SquarePad;

  return (
    <Element
      shape={shape}
      width={width}
      height={height}
      onClick={onClick}
      enabled={enabled}
      focus={focus}
      color={color}
      id={id}
    />
  );
}
