import { DiscreteMessageResolverDTO } from '@plugins/input-plugins/basic-override/message-resolver/discrete-message-resolver';

import OsxTabs from 'renderer/components/OsxTabs';
import StepConfig from './step-config/StepConfig';

type PropTypes = {
  resolver: DiscreteMessageResolverDTO;
  onChange: (state: number, binding: NumberArrayWithStatus) => void;
};

export default function ToggleDiscreteMessageResolverConfig(props: PropTypes) {
  const { resolver, onChange } = props;
  const { bindings, defaults, eligibleStatuses } = resolver;

  const TabBodies = [
    <StepConfig
      bindingMsg={bindings[0]}
      defaultMsg={defaults[0]}
      eligibleStatuses={eligibleStatuses}
      onChange={(binding) => onChange(0, binding)}
    />,
    <StepConfig
      bindingMsg={bindings[1]}
      defaultMsg={defaults[1]}
      eligibleStatuses={eligibleStatuses}
      onChange={(binding) => onChange(1, binding)}
    />,
  ];

  return <OsxTabs tabBodies={TabBodies} tabLabels={['Off', 'On']} />;
}
