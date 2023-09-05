import LinuxNoMatchingDriverView from './LinuxNoMatchingDriverView';
import OSXNoMatchingDriverView from '../NoPreviewAvailableView';

const { hostService } = window;

type PropTypes = {
  deviceName: string;
};

type Host = 'darwin' | 'linux' | 'win32';

export default function UnsupportedView(props: PropTypes) {
  const { deviceName } = props;

  const host: Host = hostService.getHost();

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
