import { selectRecentRemoteMessagesById } from '@features/recent-remote-messages/recent-remote-messages-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';

import { HorizontalHandleLayout } from './HorizontalHandleLayout';
import { VerticalHandleLayout } from './VerticalHandleLayout';

type PropTypes = {
  handleWidth: string;
  handleHeight: string;
  horizontal: boolean;
  inverted: boolean;
  id: string;
};

export function HandleLayout(props: PropTypes) {
  const { handleWidth, handleHeight, horizontal, inverted, id } = props;

  const recentMessages = useAppSelector(selectRecentRemoteMessagesById(id, 1));

  const state = {
    value: recentMessages.length ? recentMessages[0].msg[2] : 127,
  };

  const Layout = horizontal ? HorizontalHandleLayout : VerticalHandleLayout;

  return (
    <div
      className={`handle-input interactive-indicator${
        horizontal ? ' horizontal' : ''
      }`}
    >
      <Layout
        value={inverted ? 127 - state.value : state.value}
        handleWidth={handleWidth}
        handleHeight={handleHeight}
      />
    </div>
  );
}
