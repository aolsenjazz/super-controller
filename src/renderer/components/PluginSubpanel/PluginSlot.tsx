import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { useAppDispatch, useAppSelector } from '@hooks/use-app-dispatch';
import {
  selectSelectedPluginId,
  setSelectedPluginId,
} from '@features/selected-plugin-id/selected-plugin-id-slice';
import { selectPluginById } from '@features/plugins/plugins-slice';

import PluginBody from './PluginBody';
import PluginViewControl from './PluginViewControl';
import PowerButton from './PowerButton';

const { PluginService } = window;

type PropTypes = {
  pluginId: string;
  removePlugin: (pluginId: string) => void;
  importPlugin: (title: string) => Promise<React.FC<PluginUIProps>>;
};

/**
 * Each plugin slot represents an array of plugins, where selecting n inputs/devices
 * can cause a single plugin slot to represent n plugins, if all homogenous.
 */
export default function PluginSlot(props: PropTypes) {
  const { pluginId, removePlugin, importPlugin } = props;

  const dispatch = useAppDispatch();
  const selectedPlugin = useSelector(selectSelectedPluginId);
  const plugin = useAppSelector((state) => selectPluginById(state, pluginId));

  const selected = selectedPlugin === pluginId;

  const onClick = useCallback(() => {
    dispatch(setSelectedPluginId(pluginId));
  }, [pluginId, dispatch]);

  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 8 && selected === true) {
        removePlugin(pluginId);
      }
    },
    [removePlugin, pluginId, selected]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleBackspace);
    return () => {
      document.removeEventListener('keydown', handleBackspace);
    };
  }, [handleBackspace, selected]);

  const onPowerButtonClick = () => {
    PluginService.togglePower(pluginId);
  };

  return (
    <div className={`plugin-slot filled ${selected ? 'selected' : ''}`}>
      <div className="plugin-header" onClick={onClick} role="presentation">
        <PowerButton on={plugin.on} onClick={onPowerButtonClick} />
        <PluginViewControl plugin={plugin} />
        <h5>{plugin.title}</h5>
      </div>
      {!plugin.collapsed && (
        <PluginBody
          pluginId={pluginId}
          title={plugin.title}
          importPlugin={importPlugin}
        />
      )}
    </div>
  );
}
