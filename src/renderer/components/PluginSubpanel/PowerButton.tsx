import { useCallback } from 'react';

import type { PluginDTO } from '@shared/plugin-core/base-plugin';
import { PluginAggregate } from './plugin-aggregate';
import HalfOnPowerButton from './HalfOnPowerButton';

const { PluginService } = window;

type PropTypes = {
  plugins: PluginDTO[];
  deviceId: string;
};

export default function PowerButton(props: PropTypes) {
  const { plugins, deviceId } = props;

  const aggregate = new PluginAggregate(plugins);

  const onClick = useCallback(
    (on: boolean) => {
      const newPlugins = plugins.map((p) => {
        return {
          ...p,
          on,
        };
      });

      newPlugins.forEach((p) => PluginService.updatePlugin(deviceId, p));
    },
    [plugins, deviceId]
  );

  return (
    <>
      {aggregate.on === '<multiple values>' ? (
        <HalfOnPowerButton onClick={onClick} />
      ) : (
        <div
          className={`power-button ${aggregate.on ? 'on' : 'off'}`}
          onClick={() => onClick(!aggregate.on)}
          role="presentation"
        />
      )}
    </>
  );
}
