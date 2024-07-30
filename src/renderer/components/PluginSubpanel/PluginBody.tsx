import { PluginIcicle } from '@plugins/base-plugin';

type PropTypes = {
  plugins: PluginIcicle[];
};

export default function PluginBody(props: PropTypes) {
  const { plugins } = props;
  // const path = '../../../plugins/input-plugins/basic-override/gui.tsx';
  const path = '../BasicSelect.tsx';

  // const GUI = require(plugins[0].GUIPath);

  import(`${path}`).then((GUI) => {
    console.log(GUI);
  });
  // const GUI = require('../../../plugins/input-plugins/basic-override/gui.tsx');

  return <div className="plugin-body"></div>;
}
