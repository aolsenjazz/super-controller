import { selectInputConfigById } from '@features/input-configs/input-configs-slice';
import { selectSelectedInputId } from '@features/selected-input-id/selected-input-id-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { useSelector } from 'react-redux';

import BasicMessage from './BasicMessage';
import InputConfigPanel from './InputConfigPanel';

export default function InputConfigDrawer() {
  const selectedDevice = useSelector(selectSelectedDevice);
  const config = selectedDevice?.config;
  const selectedInput = useSelector(selectSelectedInputId);
  const inputConfig = useAppSelector((state) =>
    selectInputConfigById(state, selectedInput || ''),
  );

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  } else if (config && config.driverName === 'Anonymous') {
    Element = (
      <BasicMessage msg="This device isn't supported yet, so you can't customize individual knobs and buttons. However, you can still add Device Plugins in the left panel." />
    );
  } else if (!inputConfig) {
    Element = <BasicMessage msg="No inputs selected." />;
  } else if (config && inputConfig) {
    Element = <InputConfigPanel input={inputConfig} />;
  } else {
    return null;
  }

  return (
    <div id="config-panel" className="top-level">
      {Element}
    </div>
  );
}
