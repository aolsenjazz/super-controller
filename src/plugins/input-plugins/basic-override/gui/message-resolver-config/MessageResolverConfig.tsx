import { ResolverDTOType } from '../..';
import BinaryMessageResolverConfig from './BinaryMessageResolverConfig';
import ContinuousMessageResolverConfig from './ContinuousMessageResolverConfig';
import DiscreetMessageResolverConfig from './DiscreetMessageResolverConfig';
import PitchbendMessageResolverConfig from './PitchbendMessageResolverConfig';

type PropTypes = {
  messageResolver: ResolverDTOType;
};

export default function MessageResolverConfig(props: PropTypes) {
  const { messageResolver } = props;
  const { className } = messageResolver;

  switch (className) {
    case 'ContinuousMessageResolver':
      return <ContinuousMessageResolverConfig resolver={messageResolver} />;
    case 'BinaryMessageResolver':
      return <BinaryMessageResolverConfig resolver={messageResolver} />;
    case 'PitchbendMessageResolver':
      return <PitchbendMessageResolverConfig resolver={messageResolver} />;
    default:
      return <DiscreetMessageResolverConfig resolver={messageResolver} />;
  }
}
