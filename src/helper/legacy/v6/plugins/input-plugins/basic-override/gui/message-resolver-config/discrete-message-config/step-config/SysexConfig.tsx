import React, { useState, useEffect } from 'react';
import { byteToStatusString } from '../../../../util';
import { MessageResolver } from '../../../../message-resolver/message-resolver';
import { StatusSelect } from '../../../StatusSelect';
import { initMessage } from '../../../../message-resolver/discrete-message-resolver';

type PropTypes = {
  defaultMsg: NumberArrayWithStatus;
  bindingMsg: NumberArrayWithStatus;
  eligibleStatuses: MessageResolver['eligibleStatuses'];
  onChange: (binding: NumberArrayWithStatus) => void;
};

export default function SysexConfig(props: PropTypes) {
  const { defaultMsg, bindingMsg, eligibleStatuses, onChange } = props;

  const [sysexInput, setSysexInput] = useState('');
  const [isValid, setIsValid] = useState(true);

  const defaultStatus = byteToStatusString(
    (defaultMsg[0] & 0xf0) as StatusByte,
    true
  );

  const statusOverride = byteToStatusString(
    (bindingMsg[0] & 0xf0) as StatusByte,
    true
  );

  // Initialize sysexInput from bindingMsg when the component mounts or updates
  useEffect(() => {
    if (bindingMsg[0] !== 0xf0 || bindingMsg[bindingMsg.length - 1] !== 0xf7) {
      // Invalid sysex message
      setSysexInput('');
      setIsValid(false);
    } else {
      const dataBytes = bindingMsg.slice(1, bindingMsg.length - 1);
      const hexStrings = dataBytes.map((byte) =>
        byte.toString(16).padStart(2, '0')
      );
      const sysexStr = hexStrings.join(' ');
      setSysexInput(sysexStr);
      setIsValid(true);
    }
  }, [bindingMsg]);

  // Handle changes in the textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSysexInput(value);

    // Validate the input pattern
    const isValidInput = /^([0-9a-fA-F]{2})(?:\s[0-9a-fA-F]{2})*$/.test(value);

    if (isValidInput) {
      // Convert the hex string back to bytes
      const byteStrings = value.trim().split(' ');
      const dataBytes = byteStrings.map((byteStr) => parseInt(byteStr, 16));

      // Check that all bytes are between 0x00 and 0x7F
      const allBytesValid = dataBytes.every(
        (byte) => byte >= 0x00 && byte <= 0x7f
      );

      setIsValid(allBytesValid);

      if (allBytesValid) {
        // Create new binding message with 0xF0 at start and 0xF7 at end
        const newBindingMsg = [
          0xf0,
          ...dataBytes,
          0xf7,
        ] as NumberArrayWithStatus;
        onChange(newBindingMsg);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleStatusChange = (status: StatusString | 'noteon/noteoff') => {
    const defaultChannel = (defaultMsg[0] & 0x0f) as Channel;
    const defaultNumber = defaultMsg[1] as MidiNumber;

    const newBinding = initMessage(status, defaultChannel, defaultNumber, 127);
    onChange(newBinding);
  };

  return (
    <div className="sysex-config">
      <StatusSelect
        eligibleStatuses={eligibleStatuses}
        defaultStatus={defaultStatus}
        statusOverride={statusOverride}
        onStatusChange={handleStatusChange}
      />
      <textarea
        value={sysexInput}
        onChange={handleInputChange}
        placeholder="e.g. 49 28 2e"
        style={{
          resize: 'none',
          width: '100%',
          height: '100px',
          borderColor: isValid ? '#ccc' : 'red',
          padding: '8px',
          boxSizing: 'border-box',
          marginTop: '8px',
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
}
