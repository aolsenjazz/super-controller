import {
  AdapterDeviceConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';

import HelpTip from '../HelpTip';
import DriverRequestButton from '../DriverRequestButton';
import BasicSelect from './BasicSelect';

const { driverService, projectService } = window;

type PropTypes = {
  config: AdapterDeviceConfig;
  project: Project;
  setProject: (p: Project) => void;
};

const tipBody = `When using a 5-pin adapter, only the adapter is visible to SuperController. Select your connected 5-pin device from the dropdown below.

   Don't see your device? Request it using the button below.`;

export default function AdapterView(props: PropTypes) {
  const { config, project, setProject } = props;

  const drivers = driverService.getFivePinDrivers();

  const valueList = Array.from(drivers.keys());
  const labelList = Array.from(drivers.keys());
  const value = '';

  const onChange = (v: string | number) => {
    const childDriver = driverService.getDriver(v as string);
    const childConfig = configFromDriver(
      config.siblingIndex,
      childDriver!
    ) as SupportedDeviceConfig;
    config.setChild(childConfig);
    project.addDevice(config);
    setProject(new Project(project.devices)); // update in frontend
    projectService.addDevice(config.toJSON(false)); // update in backend
  };

  return (
    <div id="adapter-view-container">
      <h2>{config.name}</h2>
      <div className="subtitle-container">
        <h3>5-pin adapter</h3>
        <HelpTip body={tipBody} />
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
