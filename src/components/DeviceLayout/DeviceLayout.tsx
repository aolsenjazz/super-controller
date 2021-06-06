import React, { useRef, useState, useEffect } from 'react';
import AspectRatio from 'react-aspect-ratio';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';

import { SupportedDeviceConfig } from '../../hardware-config';
import { VirtualDevice } from '../../virtual-devices';

import 'react-aspect-ratio/aspect-ratio.css';

type PropTypes = {
  device: VirtualDevice;
  deviceConfig: SupportedDeviceConfig;
  onClick: (event: React.MouseEvent, id: string) => void;
  selectedInputs: string[];
  configured: boolean;
};

/**
 * Root container for virtual device layouts. `DeviceLayout`, graphically, covers all
 * of the area contained in and including the outline of the device.
 */
export default function DeviceLayout(props: PropTypes) {
  const { device, onClick, selectedInputs, configured, deviceConfig } = props;
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
      style={{ maxWidth: 'calc(100vh)', ...device.style }}
      className="device-layout"
    >
      <div id={device.name} ref={rootRef}>
        {device.keyboard ? (
          <Keyboard
            nOctaves={device.keyboard.nOctaves}
            style={device.keyboard.style}
          />
        ) : null}

        {device.inputGrids.map((inputGrid) => (
          <InputGridLayout
            key={inputGrid.id}
            inputGrid={inputGrid}
            deviceWidth={width}
            onClick={onClick}
            selectedInputs={selectedInputs}
            configured={configured}
            deviceConfig={deviceConfig}
          />
        ))}
      </div>
    </AspectRatio>
  );
}
