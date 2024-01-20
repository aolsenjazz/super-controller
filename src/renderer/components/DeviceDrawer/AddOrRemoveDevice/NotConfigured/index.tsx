import LinuxNotConfigured from './LinuxNotConfigured';
import OSXNotConfigured from './OSXNotConfigured';

const { HostService } = window;

export default function NotConfigured() {
  const host = HostService.getHost();

  return host === 'darwin' ? <OSXNotConfigured /> : <LinuxNotConfigured />;
}
