import { useState } from 'react';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { usePlugin } from '@hooks/use-plugin';

import { TranslatorDTO } from '../index';
import { MidiEventTable } from './MidiEventTable';
import { OverrideControls } from './OverrideControls';

import './translator.css';

export default function GUI(props: PluginUIProps) {
  const { pluginId, selectedDevice } = props;

  const [selectedSource, setSelectedSource] = useState<
    NumberArrayWithStatus | undefined
  >(undefined);

  const { plugin } = usePlugin<TranslatorDTO>(pluginId);

  return (
    <div className="translator">
      <MidiEventTable
        setSelectedSource={setSelectedSource}
        deviceName={selectedDevice.driverName}
        deviceId={selectedDevice.id}
      />

      <div className="overrides">
        <OverrideControls
          setSelectedSource={setSelectedSource}
          selectedSource={selectedSource}
          overrides={plugin.overrides}
          pluginId={pluginId}
        />
      </div>
    </div>
  );
}
