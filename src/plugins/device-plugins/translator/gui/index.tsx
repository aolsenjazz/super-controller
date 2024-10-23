import { useState } from 'react';

import type { TranslatorDTO } from '..';
import type { PluginUIProps } from '../../../core/plugin-ui-props';

import { MidiEventTable } from './MidiEventTable';
import { OverrideControls } from './OverrideControls';

import './translator.css';

export default function GUI(props: PluginUIProps<TranslatorDTO>) {
  const { plugin, selectedDevice, applyChanges } = props;

  const [selectedSource, setSelectedSource] = useState<
    NumberArrayWithStatus | undefined
  >(undefined);

  return (
    <div className="translator">
      <MidiEventTable
        setSelectedSource={setSelectedSource}
        deviceName={selectedDevice.portName}
        deviceId={selectedDevice.id}
      />

      <div className="overrides">
        <OverrideControls
          setSelectedSource={setSelectedSource}
          selectedSource={selectedSource}
          plugin={plugin}
          applyChanges={applyChanges}
        />
      </div>
    </div>
  );
}
