import { useSelectedDevice } from '@context/selected-device-context';
import { useSelectedInputConfigs } from '@context/selected-input-configs-context';
import { useSelectedInputs } from '@context/selected-inputs-context';
import { useDeviceConfig } from '@hooks/use-device-config';

import BasicMessage from './BasicMessage';
import InputConfigPanel from './InputConfigPanel';

export default function InputConfigDrawer() {
  const { selectedDevice } = useSelectedDevice();
  const { selectedInputs } = useSelectedInputs();

  const { deviceConfig } = useDeviceConfig(selectedDevice || '');
  const { inputConfigs } = useSelectedInputConfigs();

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  } else if (deviceConfig && deviceConfig.driverName === 'Anonymous') {
    Element = (
      <BasicMessage msg="This device isn't supported yet, so you can't customize individual knob and buttons. However, you can still add Device Plugins in the left panel." />
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
