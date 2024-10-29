import LinuxNoMatchingDriverView from './LinuxNoMatchingDriverView';
import NoPreviewAvailableView from './NoPreviewAvailableView';

const { HostService } = window;

type PropTypes = {
  deviceName: string;
};

export default function NoMatchingDriverView(props: PropTypes) {
  const { deviceName } = props;

  const host = HostService.getHost();

  return (
    <>
      {host === 'linux' ? (
        <LinuxNoMatchingDriverView />
      ) : (
        <NoPreviewAvailableView deviceName={deviceName} />
      )}
    </>
  );
}
