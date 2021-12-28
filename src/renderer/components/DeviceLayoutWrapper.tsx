import { useCallback } from 'react';

import DeviceLayout from './DeviceLayout/DeviceLayout';

import { SupportedDeviceConfig } from '../../hardware-config';
import { VirtualDevice } from '../virtual-devices';
import { Project } from '../../project';

type PropTypes = {
  device: VirtualDevice;
  config: SupportedDeviceConfig;
  project: Project;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

/**
 * @callback setSelectedInputs
 * @param { string[] } inputs The newly-selected inputs
 */

/**
 * Wrapper for the DeviceLayout
 *
 * @param { object } props Component props
 * @param { VirtualDevice } props.device The VirtualDevice representation
 * @param { SupportedDeviceConfig } props.config Device config
 * @param { Project } props.project The active Project
 * @param { string[] } props.selectedInputs List of the ids of the selected inputs
 * @param { setSelectedInputs } props.setSelectedInputs Sets the selected inputs
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
