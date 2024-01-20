import { useSelectedDevice } from '@context/selected-device-context';
import { useSelectedInputs } from '@context/selected-inputs-context';
import { useConfigStub } from '@hooks/use-config-stub';
import { useInputConfigs } from '@hooks/use-input-configs';

import Translator from './Translator';
import BasicMessage from './BasicMessage';
import DeviceConfigPanel from './DeviceConfigPanel';
import InputConfigSubpanel from './InputConfigSubpanel';

export default function ConfigPanel() {
  const { selectedDevice } = useSelectedDevice();
  const { selectedInputs } = useSelectedInputs();

  const { configStub } = useConfigStub(selectedDevice || '');
  const { inputConfigs } = useInputConfigs(
    selectedDevice || '',
    selectedInputs
  );

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  }
  // else if (configStub === undefined) {
  // Element = <NotConfigured />;
  // }
  else if (configStub && configStub.driverName === 'Anonymous') {
    Element = <Translator config={configStub} />;
  } else if (inputConfigs.length === 0) {
    Element = <BasicMessage msg="No inputs selected." />;
  } else if (configStub) {
    Element = (
      <InputConfigSubpanel config={configStub} inputConfigs={inputConfigs} />
    );
  } else {
    return null;
  }

  return (
    <div id="config-panel" className="top-level">
      {configStub && <DeviceConfigPanel config={configStub} />}
      {Element}
    </div>
  );
}
