import { ReactNode } from 'react';

import { ResolverDTOType } from '../..';
import BinaryMessageResolverConfig from './BinaryMessageResolverConfig';
import ContinuousMessageResolverConfig from './ContinuousMessageResolverConfig';
import DiscreteMessageResolverConfig from './discrete-message-config/DiscreteMessageResolverConfig';
import PitchbendMessageResolverConfig from './PitchbendMessageResolverConfig';
import { StateManager } from '../../state-manager/state-manager';

type PropTypes = {
  messageResolver: ResolverDTOType;
  onChange: (resolver: ResolverDTOType) => void;
  outputStrategy: StateManager['outputStrategy'];
};

export default function MessageResolverConfig(props: PropTypes) {
  const { messageResolver, onChange, outputStrategy } = props;
  const { className } = messageResolver;

  let Element: ReactNode;
  switch (className) {
    case 'ContinuousMessageResolver':
      Element = (
        <ContinuousMessageResolverConfig
          resolver={messageResolver}
          onChange={onChange}
        />
      );
      break;
    case 'BinaryMessageResolver':
      Element = (
        <BinaryMessageResolverConfig
          resolver={messageResolver}
          onChange={onChange}
        />
      );
      break;
    case 'PitchbendMessageResolver':
      Element = (
        <PitchbendMessageResolverConfig
          resolver={messageResolver}
          onChange={onChange}
        />
      );
      break;
    default:
      Element = (
        <DiscreteMessageResolverConfig
          resolver={messageResolver}
          onChange={onChange}
          outputStrategy={outputStrategy}
        />
      );
  }

  return Element;
}
