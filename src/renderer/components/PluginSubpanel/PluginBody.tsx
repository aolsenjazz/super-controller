import { importDeviceSubcomponent } from '@plugins/index';
import { PluginIcicle } from '@plugins/base-plugin';
import { useEffect, useState } from 'react';

type PropTypes = {
  plugins: PluginIcicle[];
};

export default function PluginBody(props: PropTypes) {
  const { plugins } = props;

  const [UI, setUI] = useState<JSX.Element>();

  useEffect(() => {
    importDeviceSubcomponent(plugins[0].title, 'gui')
      .then((m) => {
        const elem: JSX.Element = m.default;
        setUI(elem);
        return null;
      })
      .catch((e) => {
        throw e;
      });
  }, [plugins]);

  return <div className="plugin-body">{UI}</div>;
}
