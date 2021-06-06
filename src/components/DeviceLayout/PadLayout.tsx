import React from 'react';

import { Color } from '../../driver-types';

type PropTypes = {
  onClick: (event: React.MouseEvent, id: string) => void;
  id: string;
  shape: string | undefined;
  color: Color | undefined;
  width: number;
  height: number;
  enabled: boolean;
  focus: boolean;
};

export default function Pad(props: PropTypes) {
  const { shape, width, height, onClick, enabled, focus, color, id } = props;

  return (
    <div
      className={`pad ${focus ? 'focus' : ''} ${enabled ? 'hoverable' : ''}`}
      onMouseDown={(event) => {
        onClick(event, id);
      }}
      style={{
        width: Math.floor(width),
        height: Math.floor(height),
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
