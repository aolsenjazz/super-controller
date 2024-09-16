import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { SwitchIcicle } from '@shared/hardware-config/input-config/switch-config';

type PropTypes = {
  deviceConfig: DeviceConfigDTO;
  inputConfigStub: SwitchIcicle;
};

export default function SwitchConfigSubpanel(_props: PropTypes) {
  return null;
  // const { deviceConfig, inputConfigStub } = props;

  // const { driver } = useDeviceDriver(deviceConfig.id);
  // const [inputDriver, setInputDriver] = useState<SwitchDriver>();

  // useEffect(() => {
  //   if (driver === undefined) return;
  //   driver.inputGrids.forEach((ig) => {
  //     ig.inputs.forEach((i) => {
  //       if (i.interactive && id(i) === inputConfigStub.id) {
  //         setInputDriver(i as SwitchDriver);
  //       }
  //     });
  //   });
  // }, [driver, inputConfigStub]);

  // if (inputDriver === undefined) return null;

  // const labels = inputDriver.stepLabels;
  // const bodies = inputDriver.steps.map((msg) => {
  //   return (
  //     <SwitchStepConfig
  //       override={inputConfigStub.steps.get(JSON.stringify(msg))!}
  //       config={inputConfigStub}
  //       defaultMsg={msg}
  //       deviceId={deviceConfig.id}
  //     />
  //   );
  // });
  // return (
  //   <div id="switch-panel">
  //     <OsxTabs tabBodies={bodies} tabLabels={labels} />
  //   </div>
  // );
}
