import { useSelectedDeviceConfig } from '@context/selected-device-config-context';
import { useSelectedDevice } from '@context/selected-device-context';
import { useSelectedInputConfigs } from '@context/selected-input-configs-context';
import { useSelectedInputs } from '@context/selected-inputs-context';

import BasicMessage from './BasicMessage';
import InputConfigPanel from './InputConfigPanel';

export default function InputConfigDrawer() {
  const { selectedDevice } = useSelectedDevice();
  const { selectedInputs } = useSelectedInputs();

  const { deviceConfig } = useSelectedDeviceConfig();
  const { inputConfigs } = useSelectedInputConfigs();

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  } else if (deviceConfig && deviceConfig.driverName === 'Anonymous') {
    Element = (
      <BasicMessage msg="This device isn't supported yet, so you can't customize individual knob and buttons. However, you can still get a lot done by adding Device Plugins in the left panel." />
    );
  } else if (selectedInputs.length === 0) {
    Element = <BasicMessage msg="No inputs selected." />;
  } else if (deviceConfig && inputConfigs.length > 0) {
    Element = (
      <InputConfigPanel config={deviceConfig} inputConfigs={inputConfigs} />
    );
  } else {
    return null;
  }

  return (
    <div id="config-panel" className="top-level">
      {Element}
    </div>
  );
}
