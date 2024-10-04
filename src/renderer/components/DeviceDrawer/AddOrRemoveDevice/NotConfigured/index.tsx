import LinuxNotConfigured from './LinuxNotConfigured';
import BasicNotConfigured from './BasicNotConfigured';

const { HostService } = window;

type PropTypes = {
  name: string;
  siblingIndex: number;
};

export default function NotConfigured(props: PropTypes) {
  const { name, siblingIndex } = props;

  const host = HostService.getHost();

  return host === 'darwin' ? (
    <BasicNotConfigured name={name} siblingIndex={siblingIndex} />
  ) : (
    <LinuxNotConfigured name={name} siblingIndex={siblingIndex} />
  );
}
