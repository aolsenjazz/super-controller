import { useSelectedDevice } from '@context/selected-device-context';
import { useSelectedInputs } from '@context/selected-inputs-context';
import { useConfigStub } from '@hooks/use-config-stub';

import Translator from './Translator';
import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import DeviceConfigPanel from './DeviceConfigPanel';
import InputConfigSubpanel from './InputConfigSubpanel';

export default function ConfigPanel() {
  const { selectedDevice } = useSelectedDevice();
  const { selectedInputs } = useSelectedInputs();
  const { configStub } = useConfigStub(selectedDevice || '');

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  }

  if (configStub === undefined) {
    Element = <NotConfigured />;
  } else if (configStub.driverName === 'Anonymous') {
    Element = <Translator config={configStub} />;
  } else if (selectedInputs.length === 0) {
    Element = <BasicMessage msg="No inputs selected." />;
  } else {
    Element = (
      <InputConfigSubpanel
        config={configStub}
        selectedInputs={selectedInputs}
      />
    );
  }

  return (
    <div id="config-panel" className="top-level">
      {configStub && <DeviceConfigPanel config={configStub} />}
      {Element}
    </div>
  );
}
