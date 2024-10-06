import { useSelectedInputConfigs } from '@context/selected-input-configs-context';
import { useSelectedInputs } from '@context/selected-inputs-context';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { useSelector } from 'react-redux';

import BasicMessage from './BasicMessage';
import InputConfigPanel from './InputConfigPanel';

export default function InputConfigDrawer() {
  const selectedDevice = useSelector(selectSelectedDevice)!;
  const { config } = selectedDevice;
  const { selectedInputs } = useSelectedInputs();

  const { inputConfigs } = useSelectedInputConfigs();

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
