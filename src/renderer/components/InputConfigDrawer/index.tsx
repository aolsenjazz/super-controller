import { selectInputConfigById } from '@features/input-configs/input-configs-slice';
import { selectSelectedInput } from '@features/selected-input/selected-input-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { useSelector } from 'react-redux';

import BasicMessage from './BasicMessage';
import InputConfigPanel from './InputConfigPanel';

export default function InputConfigDrawer() {
  const selectedDevice = useSelector(selectSelectedDevice);
  const config = selectedDevice?.config;
  const selectedInput = useSelector(selectSelectedInput);
  const inputConfig = useAppSelector((state) =>
    selectInputConfigById(state, selectedInput)
  );

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  } else if (config && config.driverName === 'Anonymous') {
    Element = (
      <BasicMessage msg="This device isn't supported yet, so you can't customize individual knob and buttons. However, you can still add Device Plugins in the left panel." />
    );
  } else if (selectedInput === '') {
    Element = <BasicMessage msg="No inputs selected." />;
  } else if (config && inputConfig) {
    Element = <InputConfigPanel config={config} input={inputConfig} />;
  } else {
    return null;
  }

  return (
    <div id="config-panel" className="top-level">
      {Element}
    </div>
  );
}
