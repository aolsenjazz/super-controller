import { useLayoutEffect, useState } from 'react';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import { TranslatorDTO } from '../index';
import { MidiEventOverride } from '../midi-event-override';
import { MidiEventTable } from './MidiEventTable';
import { OverrideControls } from './OverrideControls';

import './translator.css';

const { PluginService } = window;

export default function GUI(props: PluginUIProps) {
  const { pluginId, selectedDevice } = props;

  const [selectedSource, setSelectedSource] = useState<
    NumberArrayWithStatus | undefined
  >(undefined);

  const [overrides, setOverrides] = useState<MidiEventOverride[]>([]);

  useLayoutEffect(() => {
    const plugin = PluginService.getPlugin<TranslatorDTO>(pluginId);
    setOverrides(plugin!.overrides);
  }, [pluginId]);

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
          overrides={overrides}
          setOverrides={setOverrides}
        />
      </div>
    </div>
  );
}
