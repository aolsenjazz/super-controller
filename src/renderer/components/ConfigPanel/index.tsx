import { useSelectedDevice } from '@context/selected-device-context';
import { useSelectedInputs } from '@context/selected-inputs-context';
import { useConfigStub } from '@hooks/use-config-stub';
import { useInputConfigs } from '@hooks/use-input-configs';

import BasicMessage from './BasicMessage';
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
  } else if (configStub && configStub.driverName === 'Anonymous') {
    Element = (
      <BasicMessage msg="This device isn't supported yet, so you can't customize individual knob and buttons. However, you can still get a lot done by adding Device Plugins in the left panel." />
    );
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
      {Element}
    </div>
  );
}
