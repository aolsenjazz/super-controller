import { SliderItem, GetHandleProps } from 'react-compound-slider';

type HandlePropTypes = {
  domain: ReadonlyArray<number>;
  handle: SliderItem;
  getHandleProps: GetHandleProps;
};

export default function Handle(props: HandlePropTypes) {
  const { domain, handle, getHandleProps } = props;
  const [min, max] = domain;
  const { id, value, percent } = handle;

  return (
    <div
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: '-4px',
        marginTop: '-7px',
        zIndex: 2,
        width: 8,
        height: 18,
        cursor: 'pointer',
        borderRadius: '4px',
        boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getHandleProps(id)}
    />
  );
}
