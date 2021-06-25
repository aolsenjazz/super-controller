import React, { useCallback } from 'react';

import SelectTab from '../../assets/select-tab.svg';
import SettingsLineItem from './SettingsLineItem';

import { ipcRenderer } from '../../ipc-renderer';
import { Color } from '../../driver-types';
import { InputGroup } from '../../input-group';
import { Project } from '../../project';

type LightResponsePropTypes = {
  group: InputGroup;
  project: Project;
  deviceId: string;
};

/**
 * Multi-select for the event propagation response to devices.
 *
 * @param { object } props Component props
 * @param { InputGroup } props.group Input group
 * @param { Project } props.project Current project
 * @param { string } props.deviceId ID of the selected device
 */
function LightResponse(props: LightResponsePropTypes) {
  const { group, project, deviceId } = props;

  const { eligibleLightResponses } = group;

  const onChange = (val: string | number) => {
    const inputIds = group.inputs.map((input) => input.id);
    group.inputs.forEach((config) => {
      config.lightResponse = val as 'gate' | 'toggle';
    });

    ipcRenderer.sendProject(project, true, deviceId, inputIds);
  };

  return (
    <SettingsLineItem
      label="Light Response"
      value={group.lightResponse}
      valueList={eligibleLightResponses}
      labelList={eligibleLightResponses}
      onChange={onChange}
    />
  );
}

type PropTypes = {
  group: InputGroup;
  project: Project;
  deviceId: string;
};

/**
 * Controls for adjusting the settings of backlights. Choose colors, propagation method, etc.
 *
 * @param { object } props Component props
 * @param { InputGroup } props.group Input group
 * @param { Project } props.project Current project
 * @param { string } props.deviceId ID of the currently-selected device
 */
export default function BacklightSettings(props: PropTypes) {
  const { group, project, deviceId } = props;

  const { eligibleLightStates, eligibleColors } = group;
  const isLightable = eligibleColors.length > 0;

  const onChange = useCallback(
    (e, state: string) => {
      // Update all InputConfigs in the InputGroup
      const color = JSON.parse(e.target.value);
      const inputIds = group.inputs.map((input) => input.id);
      group.inputs.forEach((input) => {
        input.setColorForState(state, color);
        ipcRenderer.sendProject(project, true, deviceId, inputIds);
      });
    },
    [group, project, deviceId]
  );

  return (
    <>
      {isLightable ? (
        <>
          <h3>Backlight Settings</h3>
          <LightResponse group={group} project={project} deviceId={deviceId} />
          {eligibleLightStates.map((state: string) => {
            const stateColor = group.colorForState(state);
            const isMultiple = stateColor === '<multiple values>';

            let colorString =
              isMultiple || stateColor === null
                ? undefined
                : (stateColor as Color).string;
            colorString =
              colorString === undefined ? 'transparent' : colorString;

            return (
              <div className="settings-line color-setting" key={state}>
                <p>State: {state}</p>
                <div
                  className="color-sample"
                  style={{ backgroundColor: `${colorString}` }}
                />
                <div className="ios-select">
                  <div className="ios-select-tab">
                    <img src={SelectTab} alt="" />
                    <img src={SelectTab} alt="" />
                  </div>
                  <select
                    value={JSON.stringify(stateColor)}
                    onChange={(e) => onChange(e, state)}
                  >
                    {isMultiple ? (
                      <option
                        value={JSON.stringify('<multiple values>')}
                        disabled
                      >
                        &#60;Multiple Values&#62;
                      </option>
                    ) : null}
                    {eligibleColors.map((c) => {
                      return (
                        <option
                          value={JSON.stringify(c)}
                          key={JSON.stringify(c)}
                        >
                          {c.name}
                          {c.modifier ? ` (${c.modifier})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
}
