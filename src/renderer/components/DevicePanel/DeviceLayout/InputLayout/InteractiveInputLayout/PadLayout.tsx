import { useEffect, useState } from 'react';

import { PadStub } from '@shared/hardware-config/input-config/pad-config';
import { useSelectedDevice } from '@context/selected-device-context';
import { useConfiguredDevices } from '@hooks/use-configured-devices';

const { deviceService } = window;

type PropTypes = {
  shape: string;
  id: string;
};

export default function Pad(props: PropTypes) {
  const { shape, id } = props;
  const { selectedDevice } = useSelectedDevice();
  const { configStubs } = useConfiguredDevices();

  const [stub, setStub] = useState<PadStub>();

  useEffect(() => {
    const cb = (desc: PadStub) => {
      setStub(desc);
    };

    const off = deviceService.onInputChange(selectedDevice!, id, cb);
    deviceService.requestInputStub(selectedDevice!, id);

    return () => {
      setStub({
        color: undefined,
        fx: undefined,
      });
      off();
    };
  }, [id, selectedDevice, configStubs]);

  const mod = stub?.color?.modifier || stub?.fx?.title;

  return (
    <div
      className="pad interactive-indicator"
      style={{
        animationName: mod,
        backgroundColor: stub?.color?.string,
        animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
