import React from 'react';

import DeviceView from './DeviceView';

import { DeviceConfig, SupportedDeviceConfig } from '../hardware-config';
import { VirtualDevice } from '../virtual-devices';
import { DRIVERS } from '../drivers';
import { Project } from '../project';

function NoDevicesView() {
  return <p id="no-devices">No connected devices.</p>;
}

function UnsupportedView() {
  return <p id="unsupported-device">This device isn&apos;t supported yet.</p>;
}

type PrimaryContentProps = {
  device: DeviceConfig | null;
  project: Project;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

function PrimaryContent(props: PrimaryContentProps) {
  const { device, project, selectedInputs, setSelectedInputs } = props;

  if (device === null) {
    return <NoDevicesView />;
  }

  if (device.supported === false) {
    return <UnsupportedView />;
  }

  const nonUndefinedDevice = device as SupportedDeviceConfig;
  const vDevice = new VirtualDevice(
    nonUndefinedDevice.id,
    DRIVERS.get(nonUndefinedDevice.name)!
  );

  return (
    <DeviceView
      device={vDevice!}
      config={nonUndefinedDevice}
      project={project}
      selectedInputs={selectedInputs}
      setSelectedInputs={setSelectedInputs}
    />
  );
}

type PropTypes = {
  device: DeviceConfig | null;
  project: Project;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

export default function DevicePanel(props: PropTypes) {
  const { device, project, selectedInputs, setSelectedInputs } = props;

  return (
    <>
      <div id="device-panel" className="top-level">
        <div className="device-container">
          <PrimaryContent
            device={device}
            project={project}
            selectedInputs={selectedInputs}
            setSelectedInputs={setSelectedInputs}
          />
        </div>
      </div>
    </>
  );
}
