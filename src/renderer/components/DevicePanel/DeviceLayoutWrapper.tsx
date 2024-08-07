import { useCallback } from 'react';

import { DeviceDriver } from '@shared/driver-types';

import DeviceLayout from './DeviceLayout';
import WarningIcon from '../WarningIcon';
import { useSelectedInputs } from '../../context/selected-inputs-context';

const throttleWarning =
  "Because this is an older device, it can't process MIDI data as fast. Messages received by this device from SuperController may have a noticeable delay.";

type PropTypes = {
  driver: DeviceDriver;
};

export default function DeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { driver } = props;

  const { selectedInputs, setSelectedInputs } = useSelectedInputs();

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
    <>
      <DeviceLayout driver={driver} onClick={onInputSelect} />
      <div className="warning-container">
        {driver.throttle ? <WarningIcon warningBody={throttleWarning} /> : null}
      </div>
    </>
  );
}
