type TickPropTypes = {
  tick: {
    id: string;
    value: number;
    percent: number;
  };
  label: string;
  count: number;
};

export default function Tick(props: TickPropTypes) {
  const { tick, label, count } = props;
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          marginTop: -2,
          width: 2,
          marginLeft: -1,
          height: 8,
          borderRadius: '1px',
          backgroundColor: 'rgb(200,200,200)',
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          marginTop: 10,
          fontSize: 10,
          textAlign: 'center',
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        <p>{label}</p>
      </div>
    </div>
  );
}
