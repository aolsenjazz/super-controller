import {
  selectAllInputConfigs,
  selectManyInputConfigs,
} from '@features/input-configs/input-configs-slice';
import { selectSelectedInputs } from '@features/selected-inputs/selected-inputs-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { useSelector } from 'react-redux';

import BasicMessage from './BasicMessage';
import InputConfigPanel from './InputConfigPanel';

export default function InputConfigDrawer() {
  const selectedDevice = useSelector(selectSelectedDevice);
  const config = selectedDevice?.config;
  const selectedInputs = useSelector(selectSelectedInputs);
  const inputConfigs = useAppSelector((state) =>
    selectManyInputConfigs(state, selectedInputs)
  );

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  } else if (config && config.driverName === 'Anonymous') {
    Element = (
      <BasicMessage msg="This device isn't supported yet, so you can't customize individual knob and buttons. However, you can still add Device Plugins in the left panel." />
    );
  } else if (selectedInputs.length === 0) {
    Element = <BasicMessage msg="No inputs selected." />;
  } else if (config && inputConfigs.length > 0) {
    Element = <InputConfigPanel config={config} inputConfigs={inputConfigs} />;
  } else {
    return null;
  }

  return (
    <div id="config-panel" className="top-level">
      {Element}
    </div>
  );
}
