import { useEffect, useState } from 'react';

import { PadDescriptor } from '@shared/hardware-config/input-config/pad-config';
import { useSelectedDevice } from '@context/selected-device-context';

const { deviceService } = window;

type PropTypes = {
  shape: string;
  id: string;
};

export default function Pad(props: PropTypes) {
  const { shape, id } = props;
  const { selectedDevice } = useSelectedDevice();

  const [descriptor, setDescriptor] = useState<PadDescriptor>();

  useEffect(() => {
    const cb = (desc: PadDescriptor) => {
      setDescriptor(desc);
    };

    const off = deviceService.onInputChange(selectedDevice!, id, cb);
    deviceService.requestInputDescriptor(selectedDevice!, id);

    return () => off();
  }, [id, selectedDevice]);

  const mod = descriptor?.color?.modifier || descriptor?.fx?.title;

  return (
    <div
      className="pad interactive-indicator"
      style={{
        animationName: mod,
        backgroundColor: descriptor?.color?.string,
        animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
