import { useConfiguredDevices } from '@hooks/use-configured-devices';
import { DeviceConfigStub } from '@shared/hardware-config/device-config';
import { useMemo } from 'react';

import ShareSustainLine from './ShareSustainLine';

const { ConfigService } = window;

function disambiguatedNickname(
  nickname: string,
  name: string,
  siblingIndex: number
) {
  if (nickname === name) {
    return siblingIndex === 0 ? name : `${name} (${siblingIndex})`;
  }

  return nickname;
}

type PropTypes = {
  config: DeviceConfigStub;
};

export default function ShareSustain(props: PropTypes) {
  const { config } = props;
  const { configStubs } = useConfiguredDevices();

  // get all devices which aren't this device
  const shareableDevices = useMemo(() => {
    return configStubs.filter((dev) => dev.id !== config.id);
  }, [configStubs, config.id]);

  if (shareableDevices.length === 0) return null;

  return (
    <>
      <h4>Share sustain:</h4>
      {shareableDevices.map((dev) => {
        return (
          <ShareSustainLine
            name={disambiguatedNickname(
              dev.nickname || dev.portName,
              dev.portName,
              dev.siblingIndex
            )}
            key={dev.id}
            value={config.shareSustain.includes(dev.id)}
            onChange={(checked) => {
              if (checked) config.shareSustain.push(dev.id);
              else
                config.shareSustain = config.shareSustain.filter(
                  (id) => id !== dev.id
                );

              ConfigService.updateDevice(config);
            }}
          />
        );
      })}
    </>
  );
}
