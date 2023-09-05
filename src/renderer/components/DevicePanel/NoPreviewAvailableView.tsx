import HelpTip from '../HelpTip';
import DriverRequestButton from '../DriverRequestButton';

type PropTypes = {
  deviceName: string;
};

const tipBody = `This device doesn't have a driver yet. You can still override events manually and set its nickname in the configuration panel.`;

export default function UnsupportedView(props: PropTypes) {
  const { deviceName } = props;

  return (
    <div id="unsupported-device">
      <p>No preview available.</p>
      <HelpTip body={tipBody} />
      <DriverRequestButton deviceName={deviceName} />
    </div>
  );
}
