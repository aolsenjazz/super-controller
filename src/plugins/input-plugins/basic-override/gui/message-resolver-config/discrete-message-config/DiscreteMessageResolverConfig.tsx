import { ResolverDTOType } from '@plugins/input-plugins/basic-override';
import { StateManager } from '@plugins/input-plugins/basic-override/state-manager/state-manager';
import { DiscreteMessageResolverDTO } from '../../../message-resolver/discrete-message-resolver';
import ConstantDiscreteMessageResolverConfig from './ConstantDiscreteMessageResolverConfig';
import NStepDiscreteMessageResolverConfig from './NStepDiscreteMessageResolverConfig';
import ToggleDiscreteMessageResolverConfig from './ToggleDiscreteMessageResolverConfig';

type PropTypes = {
  resolver: DiscreteMessageResolverDTO;
  onChange: (resolver: ResolverDTOType) => void;
  outputStrategy: StateManager['outputStrategy'];
};

export default function DiscreteMessageResolverConfig(props: PropTypes) {
  const { resolver, outputStrategy, onChange } = props;

  const onInnerChange = (state: number, binding: NumberArrayWithStatus) => {
    const newResolver = { ...resolver, bindings: { ...resolver.bindings } };
    newResolver.bindings[state] = binding;
    onChange(newResolver);
  };

  const onAdd = (state: number, binding: NumberArrayWithStatus) => {
    const newResolver = {
      ...resolver,
      bindings: { ...resolver.bindings },
      defaults: { ...resolver.bindings },
    };
    newResolver.bindings[state] = binding;
    newResolver.defaults[state] = binding;
    onChange(newResolver);
  };

  const onDelete = (state: number) => {
    const newResolver = {
      ...resolver,
      bindings: { ...resolver.bindings },
      defaults: { ...resolver.defaults },
    };
    delete newResolver.bindings[state];
    delete newResolver.defaults[state];
    onChange(newResolver);
  };

  if (outputStrategy === 'constant') {
    return (
      <ConstantDiscreteMessageResolverConfig
        resolver={resolver}
        onChange={onInnerChange}
      />
    );
  }

  if (outputStrategy === 'toggle') {
    return (
      <ToggleDiscreteMessageResolverConfig
        resolver={resolver}
        onChange={onInnerChange}
      />
    );
  }

  return (
    <NStepDiscreteMessageResolverConfig
      resolver={resolver}
      onChange={onInnerChange}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
}
