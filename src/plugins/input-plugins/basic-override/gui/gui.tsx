import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { BasicOverrideDTO } from '..';
import { StateManager } from '../state-manager/state-manager';
import MessageResolverConfig from './message-resolver-config/MessageResolverConfig';

type OutputStrategy = StateManager['outputStrategy'];

export default function GUI(props: PluginUIProps<BasicOverrideDTO>) {
  const { plugin, applyChanges } = props;

  const { messageResolver, outputStrategy, eligibleOutputStrategies } = plugin;

  const onOutputStrategyClick = (strat: string) => {
    applyChanges({ ...plugin, outputStrategy: strat as OutputStrategy });
  };

  return (
    <div className="basic-override">
      <label>
        Input Response:
        <select
          defaultValue={outputStrategy}
          onChange={(e) => onOutputStrategyClick(e.target.value)}
        >
          {eligibleOutputStrategies.map((strat) => {
            return <option>{strat}</option>;
          })}
        </select>
      </label>

      <MessageResolverConfig messageResolver={messageResolver} />
    </div>
  );
}
