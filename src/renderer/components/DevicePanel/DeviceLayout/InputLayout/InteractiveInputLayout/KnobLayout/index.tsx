import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectRecentRemoteMessagesById } from '@features/recent-remote-messages/recent-remote-messages-slice';

import './Knob.css';
import { EndlessKnob } from './EndlessKnob';
import { AbsoluteKnob } from './AbsoluteKnob';

type PropTypes = {
  id: string;
  shape: string;
  endless: boolean;
};

export function Knob(props: PropTypes) {
  const { shape, endless, id } = props;

  const recentMessages = useAppSelector(selectRecentRemoteMessagesById(id, 1));
  const recentMessage =
    recentMessages.length > 0 ? recentMessages[0] : undefined;
  const value = recentMessages.length === 1 ? recentMessages[0].msg[2] : 64;

  return endless ? (
    <EndlessKnob shape={shape} recentMessage={recentMessage} />
  ) : (
    <AbsoluteKnob shape={shape} value={value} />
  );
}
