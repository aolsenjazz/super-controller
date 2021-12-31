import MacTitleBar from './MacTitleBar';
import WindowsTitleBar from './WindowsTitleBar';

const { hostService } = window;

/**
 * The uppermost gray bar. Draggable
 */
export default function TitleBar() {
  const Element =
    hostService.getHost() === 'win32' ? WindowsTitleBar : MacTitleBar;

  return (
    <>
      <Element />
    </>
  );
}
