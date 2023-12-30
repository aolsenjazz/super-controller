import LinuxNoMatchingDriverView from './LinuxNoMatchingDriverView';
import OSXNoMatchingDriverView from './NoPreviewAvailableView';

const { hostService } = window;

type PropTypes = {
  deviceName: string;
};

export default function UnsupportedView(props: PropTypes) {
  const { deviceName } = props;

  const host = hostService.getHost();

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
