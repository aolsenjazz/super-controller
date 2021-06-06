/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useRef, useState, useEffect } from 'react';
import AspectRatio from 'react-aspect-ratio';

import KeyboardIcon from './KeyboardIcon';
import InputGridIcon from './InputGridIcon';

import { DeviceDriver } from '../../driver-types';

import 'react-aspect-ratio/aspect-ratio.css';

type PropTypes = {
  device: DeviceDriver;
  active: boolean;
};

export default function DeviceLayout(props: PropTypes) {
  const { device, active } = props;
  const rootRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeListener = () => {
      if (!rootRef.current) return;
      setWidth(rootRef.current.getBoundingClientRect().width);
    };
    resizeListener();

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return (
    <AspectRatio
      ratio={device.aspectRatio}
      style={{ maxWidth: 'calc(100vh)' }}
      className={`device-icon ${active ? 'active' : ''}`}
    >
      <div id={device.name} ref={rootRef}>
        {device.keyboard ? (
          <KeyboardIcon style={device.keyboard.style} active={active} />
        ) : null}

        {device.inputGrids.map((inputGrid) => (
          <InputGridIcon
            key={inputGrid.id}
            inputGrid={inputGrid}
            deviceWidth={width}
            active={active}
          />
        ))}
      </div>
    </AspectRatio>
  );
}
