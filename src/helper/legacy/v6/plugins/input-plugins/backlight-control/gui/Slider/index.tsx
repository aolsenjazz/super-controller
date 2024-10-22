/* eslint-disable react/jsx-props-no-spreading */
import {
  Slider as ReactCompoundSlider,
  Rail,
  Handles,
  Ticks,
} from 'react-compound-slider';

import Handle from './Handle';
import Tick from './Tick';

const sliderStyle: React.CSSProperties = {
  position: 'relative',
};

const railStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: 4,
  borderRadius: 7,
  cursor: 'pointer',
  backgroundColor: 'rgb(210,210,210)',
};

type PropTypes = {
  lowBoundLabel: string;
  highBoundLabel: string;
  domain: [number, number];
  defaultVal: number;
  onChange: (val: number) => void;
};

export default function Slider(props: PropTypes) {
  const { lowBoundLabel, highBoundLabel, domain, defaultVal, onChange } = props;

  const labels = Array(domain[1] - domain[0] + 1).fill('');
  labels[0] = lowBoundLabel;
  labels[labels.length - 1] = highBoundLabel;

  const innerOnChange = (v: readonly number[]) => {
    onChange(v[0]);
  };

  return (
    <ReactCompoundSlider
      mode={1}
      step={1}
      domain={domain}
      rootStyle={sliderStyle}
      onChange={innerOnChange}
      className="slider"
      values={[defaultVal]}
    >
      <Rail>
        {({ getRailProps }) => <div style={railStyle} {...getRailProps()} />}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <Handle
                key={handle.id}
                handle={handle}
                domain={domain}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
      <Ticks count={labels.length}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map((tick, i) => (
              <Tick
                key={tick.id}
                tick={tick}
                label={labels[i]}
                count={labels.length}
              />
            ))}
          </div>
        )}
      </Ticks>
    </ReactCompoundSlider>
  );
}
