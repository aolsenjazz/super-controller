import React, { useCallback } from 'react';

import DeviceLayout from './DeviceLayout/DeviceLayout';

import { SupportedDeviceConfig } from '../hardware-config';
import { VirtualDevice } from '../virtual-devices';
import { Project } from '../project';

type PropTypes = {
  device: VirtualDevice;
  config: SupportedDeviceConfig;
  project: Project;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

export default function DeviceView(props: PropTypes) {
  const { device, project, selectedInputs, setSelectedInputs, config } = props;
  const configured = project.getDevice(device.id) !== null;

  const onInputSelect = useCallback(
    (event: React.MouseEvent, id: string) => {
      let next;

      if (event.ctrlKey || event.metaKey) {
        const idx = selectedInputs.indexOf(id);
        const spliced = [...selectedInputs];
        spliced.splice(idx, 1);
        next = selectedInputs.includes(id)
          ? spliced
          : selectedInputs.concat([id]);
      } else {
        next =
          JSON.stringify(selectedInputs) === JSON.stringify([id]) ? [] : [id];
      }

      setSelectedInputs(next);
    },
    [selectedInputs, setSelectedInputs]
  );

  return (
    <>
      <DeviceLayout
        device={device}
        onClick={onInputSelect}
        selectedInputs={selectedInputs}
        configured={configured}
        deviceConfig={config}
      />
    </>
  );
}
