import { PluginIcicle } from '@plugins/base-plugin';

type PropTypes = {
  plugins: PluginIcicle[];
};

export default function PluginBody(props: PropTypes) {
  const { plugins } = props;

  return <div className="plugin-body" />;
}
