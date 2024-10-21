import { DiscreteMessageResolverDTO } from '@plugins/input-plugins/basic-override/message-resolver/discrete-message-resolver';
import StepConfig from './step-config/StepConfig';

type PropTypes = {
  resolver: DiscreteMessageResolverDTO;
  onChange: (state: number, binding: NumberArrayWithStatus) => void;
};

export default function ConstantDiscreteMessageResolverConfig(
  props: PropTypes
) {
  const { resolver, onChange } = props;
  const { eligibleStatuses, bindings, defaults } = resolver;

  return (
    <StepConfig
      bindingMsg={bindings[0]}
      defaultMsg={defaults[0]}
      eligibleStatuses={eligibleStatuses}
      onChange={(binding) => onChange(0, binding)}
    />
  );
}
