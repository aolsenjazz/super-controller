import {
  AdapterDeviceConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { stringify } from '@shared/util';
import { Project } from '@shared/project';
import { DRIVERS } from '@shared/drivers';

import HelpTip from '../HelpTip';
import DriverRequestButton from '../DriverRequestButton';
import BasicSelect from '../BasicSelect';

const fivePins = new Map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Array.from(DRIVERS.entries()).filter(([_k, d]) => d.type === '5pin')
);

const { projectService } = window;

type PropTypes = {
  config: AdapterDeviceConfig;
  project: Project;
  setProject: (p: Project) => void;
};

const tipBody = `When using a 5-pin adapter, only the adapter is visible to SuperController. Select your connected 5-pin device from the dropdown below.

   Don't see your device? Request it using the button below.`;

export default function AdapterView(props: PropTypes) {
  const { config, project, setProject } = props;

  const valueList = Array.from(fivePins.keys());
  const labelList = Array.from(fivePins.keys());
  const value = '';

  const onChange = (v: string | number) => {
    const childDriver = DRIVERS.get(v as string);
    const childConfig = configFromDriver(
      childDriver!.name,
      config.siblingIndex,
      childDriver!
    ) as SupportedDeviceConfig;

    config.setChild(childConfig);
    setProject(new Project(project.devices)); // update in frontend
    projectService.updateDevice(stringify(config)); // update in backend
  };

  return (
    <div id="adapter-view-container">
      <h2>{config.portName}</h2>
      <div className="subtitle-container">
        <h3>5-pin adapter</h3>
        <HelpTip body={tipBody} transform="translateX(-300px)" />
      </div>
      <div>
        <p className="label">Select Device: </p>
        <BasicSelect
          valueList={valueList}
          labelList={labelList}
          value={value}
          onChange={onChange}
          placeholder="Choose your device"
        />
      </div>
      <DriverRequestButton />
    </div>
  );
}
