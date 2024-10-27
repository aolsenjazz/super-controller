import { PluginUIProps } from '../../../core/plugin-ui-props';
import { BasicOverrideDTO, ResolverDTOType } from '..';
import { StateManager } from '../state-manager/state-manager';

import MessageResolverConfig from './message-resolver-config/MessageResolverConfig';

import './BasicOverride.css';

type OutputStrategy = StateManager['outputStrategy'];

export default function BasicOverridePlugin(
  props: PluginUIProps<BasicOverrideDTO>
) {
  const { plugin, applyChanges } = props;

  const { messageResolver, outputStrategy, eligibleOutputStrategies } = plugin;

  const onOutputStrategyClick = (strat: string) => {
    applyChanges({ ...plugin, outputStrategy: strat as OutputStrategy });
  };

  const onResolverChange = (resolver: ResolverDTOType) => {
    const newPlugin = { ...plugin };
    newPlugin.messageResolver = resolver;
    applyChanges(newPlugin);
  };

  return (
    <div className="basic-override">
      <label>
        Output Response:
        <select
          defaultValue={outputStrategy}
          onChange={(e) => onOutputStrategyClick(e.target.value)}
        >
          {eligibleOutputStrategies.map((strat) => {
            return <option key={strat}>{strat}</option>;
          })}
        </select>
      </label>

      <MessageResolverConfig
        messageResolver={messageResolver}
        onChange={onResolverChange}
        outputStrategy={outputStrategy}
      />
    </div>
  );
}
