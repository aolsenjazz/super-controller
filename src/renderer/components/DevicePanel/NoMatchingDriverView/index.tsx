import LinuxNoMatchingDriverView from './LinuxNoMatchingDriverView';
import OSXNoMatchingDriverView from './NoPreviewAvailableView';

const { HostService } = window;

type PropTypes = {
  deviceName: string;
};

export default function UnsupportedView(props: PropTypes) {
  const { deviceName } = props;

  const host = HostService.getHost();

  return (
    <>
      {host === 'linux' ? (
        <LinuxNoMatchingDriverView />
      ) : (
        <OSXNoMatchingDriverView deviceName={deviceName} />
      )}
    </>
  );
}
