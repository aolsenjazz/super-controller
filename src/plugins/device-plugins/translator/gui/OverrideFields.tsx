import { useMemo } from 'react';
import { statusByteMap, statusBytes } from '../util';

type PropTypes = {
  source: NumberArrayWithStatus;
  override: NumberArrayWithStatus;
  updateOverride: (
    source: NumberArrayWithStatus,
    override: NumberArrayWithStatus,
    valueIndependent: boolean,
  ) => void;
  valueIndependent: boolean;
};

export default function OverrideFields(props: PropTypes) {
  const { source, override, updateOverride, valueIndependent } = props;

  // Compute default values from 'source'
  const defaultStatusByte = 0xf0 & source[0];
  const defaultChannel = 0x0f & source[0];
  const defaultNumber = source[1];
  const defaultValue = source[2];

  const statusByte = useMemo(() => 0xf0 & override[0], [override]);
  const channelByte = useMemo(() => 0x0f & override[0], [override]);
  const number = useMemo(() => override[1], [override]);
  const value = useMemo(() => override[2], [override]);

  return (
    <div className="override-fields">
      <div className="override-field">
        <label htmlFor="override-status">Event:</label>
        <select
          id="override-status"
          value={statusByte}
          onChange={(e) => {
            const val = Number(e.target.value);
            override[0] = (val | (override[0] & 0x0f)) as StatusNumber;
            updateOverride(source, override, valueIndependent);
          }}
        >
          {statusBytes.map((b) => (
            <option key={b} value={b}>
              {statusByteMap[b]} {b === defaultStatusByte && '[default]'}
            </option>
          ))}
        </select>
      </div>

      <div className="override-field">
        <label htmlFor="override-channel">Channel:</label>
        <select
          id="override-channel"
          value={channelByte}
          onChange={(e) => {
            const val = Number(e.target.value);
            override[0] = (val | (override[0] & 0xf0)) as StatusNumber;
            updateOverride(source, override, valueIndependent);
          }}
        >
          {[...Array(16).keys()].map((i) => (
            <option key={i} value={i}>
              {i} {i === defaultChannel && '[default]'}
            </option>
          ))}
        </select>
      </div>

      <div className="override-field">
        <label htmlFor="override-number">Number:</label>
        <select
          id="override-number"
          value={number}
          onChange={(e) => {
            override[1] = Number(e.target.value);
            updateOverride(source, override, valueIndependent);
          }}
        >
          {[...Array(128).keys()].map((i) => (
            <option key={i} value={i}>
              {i} {i === defaultNumber && '[default]'}
            </option>
          ))}
        </select>
      </div>

      <div className="override-field">
        <label htmlFor="override-value">Value:</label>
        <select
          id="override-value"
          value={value}
          onChange={(e) => {
            override[2] = Number(e.target.value);
            updateOverride(source, override, valueIndependent);
          }}
        >
          {[...Array(128).keys()].map((i) => (
            <option key={i} value={i}>
              {i} {i === defaultValue && '[default]'}
            </option>
          ))}
        </select>
      </div>

      <div className="override-field">
        <label htmlFor="override-value">Value independent:</label>
        <input
          type="checkbox"
          checked={valueIndependent}
          onChange={() => updateOverride(source, override, !valueIndependent)}
        />
      </div>
    </div>
  );
}
