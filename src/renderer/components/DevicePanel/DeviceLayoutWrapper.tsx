import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@hooks/use-app-dispatch';
import { DeviceDriver } from '@shared/driver-types/device-driver';
import {
  selectSelectedInputs,
  setSelectedInputs,
} from '@features/selected-inputs/selected-inputs-slice';

import DeviceLayout from './DeviceLayout';
import WarningIcon from '../WarningIcon';

const throttleWarning =
  "Because this is an older device, it can't process MIDI data as fast. Messages received by this device from SuperController may have a noticeable delay.";

type PropTypes = {
  driver: DeviceDriver;
};

export default function DeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { driver } = props;

  const dispatch = useAppDispatch();
  const selectedInputs = useSelector(selectSelectedInputs);

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

      dispatch(setSelectedInputs(next));
    },
    [dispatch, selectedInputs]
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
