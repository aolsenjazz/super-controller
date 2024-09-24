import LinuxNotConfigured from './LinuxNotConfigured';
import BasicNotConfigured from './BasicNotConfigured';

const { HostService } = window;

export default function NotConfigured() {
  const host = HostService.getHost();

  return host === 'darwin' ? <BasicNotConfigured /> : <LinuxNotConfigured />;
}
