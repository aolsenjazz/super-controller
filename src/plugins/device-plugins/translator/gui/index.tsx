import { useState } from 'react';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import { MidiEventTable } from './MidiEventTable';
import { OverrideControls } from './OverrideControls';

import './translator.css';
import type { TranslatorDTO } from '..';

export default function GUI(props: PluginUIProps<TranslatorDTO>) {
  const { plugin, selectedDevice, applyChanges } = props;

  const [selectedSource, setSelectedSource] = useState<
    NumberArrayWithStatus | undefined
  >(undefined);

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
          plugin={plugin}
          applyChange={applyChanges}
        />
      </div>
    </div>
  );
}
