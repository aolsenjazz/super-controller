import LinuxNotConfigured from './LinuxNotConfigured';
import OSXNotConfigured from './OSXNotConfigured';

const { hostService } = window;

export default function NotConfigured() {
  const host = hostService.getHost();

  return host === 'darwin' ? <OSXNotConfigured /> : <LinuxNotConfigured />;
}
