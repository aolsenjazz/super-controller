import { useCallback } from 'react';

import type { PluginIcicle } from '@plugins/base-plugin';

const { PluginService } = window;

type PropTypes = {
  icicle: PluginIcicle;
  deviceId: string;
};

export default function PowerButton(props: PropTypes) {
  const { icicle, deviceId } = props;

  const onClick = useCallback(() => {
    const newIcicle = {
      ...icicle,
      on: !icicle.on,
    };
    PluginService.updatePlugin(deviceId, newIcicle);
  }, [icicle, deviceId]);

  return (
    <div
      className={`power-button ${icicle.on ? 'on' : 'off'}`}
      onClick={onClick}
      role="presentation"
    />
  );
}
