import { useCallback } from 'react';

import { useAppDispatch } from '@hooks/use-app-dispatch';
import { DeviceDriver } from '@shared/driver-types/device-driver';
import { setSelectedInputs } from '@features/selected-inputs/selected-inputs-slice';

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

  // on input click (or ctrl+click) update selectedInputs
  const onInputSelect = useCallback(
    (_event: React.MouseEvent, ids: string[]) => {
      dispatch(setSelectedInputs(ids));
    },
    [dispatch]
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
