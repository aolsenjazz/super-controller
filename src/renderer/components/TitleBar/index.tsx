import MacTitleBar from './MacTitleBar';
import WindowsTitleBar from './WindowsTitleBar';

const { HostService } = window;

/**
 * The uppermost gray bar. Draggable
 */
export default function TitleBar() {
  const Element =
    HostService.getHost() === 'win32' ? WindowsTitleBar : MacTitleBar;

  return (
    <>
      <Element />
    </>
  );
}
