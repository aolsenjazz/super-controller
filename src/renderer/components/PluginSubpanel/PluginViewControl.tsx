import ViewClosed from '@assets/plugin_closed.svg';
import ViewOpen from '@assets/plugin_open.svg';
import { PluginDTO } from '@shared/plugin-core/base-plugin';

const { PluginService } = window;

type PropTypes = {
  plugin: PluginDTO;
};

export default function PluginViewControl(props: PropTypes) {
  const { plugin } = props;

  const onClick = () => {
    PluginService.toggleCollapsed(plugin.id);
  };

  return (
    <div onClick={onClick} role="presentation" className="view-control">
      {!plugin.collapsed ? (
        <img src={ViewOpen} alt="open plugin view" />
      ) : (
        <img src={ViewClosed} alt="close plugin view" />
      )}
    </div>
  );
}
