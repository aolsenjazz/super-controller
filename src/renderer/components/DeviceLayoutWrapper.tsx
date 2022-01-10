import { useCallback } from 'react';

import { SupportedDeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';

import DeviceLayout from './DeviceLayout/DeviceLayout';

import { VirtualDevice } from '../virtual-devices';

type PropTypes = {
  device: VirtualDevice;
  config: SupportedDeviceConfig;
  project: Project;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

/**
 * @callback setSelectedInputs
 * @param inputs The newly-selected inputs
 */

/**
 * Wrapper for the DeviceLayout
 *
 * @param props Component props
 * @param props.device The VirtualDevice representation
 * @param props.config Device config
 * @param props.project The active Project
 * @param props.selectedInputs List of the ids of the selected inputs
 * @param props.setSelectedInputs Sets the selected inputs
 */
export default function DeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { device, project, selectedInputs, setSelectedInputs, config } = props;

  const configured = project.getDevice(device.id) !== null;

  // on input click (or ctrl+click) update selectedInputs
  const onInputSelect = useCallback(
    (event: React.MouseEvent, ids: string[]) => {
      let next: string[] = [];

      if (event.ctrlKey || event.metaKey) {
        ids.forEach((id) => {
          const idx = selectedInputs.indexOf(id);
          const spliced = [...selectedInputs];
          spliced.splice(idx, 1);
          next = selectedInputs.includes(id)
            ? spliced
            : selectedInputs.concat([id]);
        });
      } else {
        next =
          JSON.stringify(selectedInputs) === JSON.stringify(ids) ? [] : ids;
      }

      setSelectedInputs(next);
    },
    [selectedInputs, setSelectedInputs]
  );

  return (
    <DeviceLayout
      device={device}
      onClick={onInputSelect}
      selectedInputs={selectedInputs}
      configured={configured}
      deviceConfig={config}
    />
  );
}
