import { useCallback } from 'react';

import { LightCapableInputConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import { colorDisplayName, stringify } from '@shared/util';

import { InputGroup } from '../../input-group';

import BasicSelect from './BasicSelect';
import FXConfig from './FXConfig';
import SettingsLineItem from './SettingsLineItem';

const { projectService } = window;

type LightResponsePropTypes = {
  group: InputGroup;
  project: Project;
  setProject: (p: Project) => void;
  configId: string;
};

/**
 * Multi-select for the event propagation response to devices.
 *
 * @param props Component props
 * @param props.group Input group
 * @param props.project Current project
 * @param props.deviceId ID of the selected device
 * @param props.setProject Frontend project setter
 */
function LightResponse(props: LightResponsePropTypes) {
  const { group, project, setProject, configId } = props;

  const { eligibleLightResponses } = group;

  const onChange = (val: string | number) => {
    group.inputs.forEach((config) => {
      const lightConf = config as LightCapableInputConfig;
      lightConf.lightResponse = val as 'gate' | 'toggle';
      projectService.updateInput(configId, stringify(config));
    });

    setProject(new Project(project.devices));
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
  setProject: (p: Project) => void;
  configId: string;
};

/**
 * Controls for adjusting the settings of backlights. Choose colors, propagation method, etc.
 *
 * @param props Component props
 * @param props.group Input group
 * @param props.project Current project
 * @param props.configId Device config ID
 */
export default function BacklightSettings(props: PropTypes) {
  const { group, project, setProject, configId } = props;

  const { eligibleLightStates, eligibleColors } = group;
  const isLightable = eligibleColors.length > 0;

  const valueList = eligibleColors.map((c) => colorDisplayName(c));
  const labelList = valueList;

  const onColorChange = useCallback(
    (colorId: string, state: number) => {
      // Update all InputConfigs in the InputGroup
      group.inputs.forEach((input) => {
        const lightConf = input as LightCapableInputConfig;
        lightConf.setColor(state, colorId);
        projectService.updateInput(configId, stringify(input));
      });

      setProject(new Project(project.devices));
    },
    [group, project, setProject, configId]
  );

  const onFxChange = useCallback(
    (fxId: string, state: number) => {
      // Update all InputConfigs in the InputGroup
      group.inputs.forEach((input) => {
        const lightConf = input as LightCapableInputConfig;
        lightConf.setFx(state, fxId);
        projectService.updateInput(configId, stringify(input));
      });

      setProject(new Project(project.devices));
    },
    [group, project, setProject, configId]
  );

  const onFxValChange = useCallback(
    (fxVal: MidiNumber[], state: number) => {
      // Update all InputConfigs in the InputGroup
      group.inputs.forEach((input) => {
        const lightConf = input as LightCapableInputConfig;
        lightConf.setFx(state, fxVal);
        projectService.updateInput(configId, stringify(input));
      });

      setProject(new Project(project.devices));
    },
    [group, project, setProject, configId]
  );

  return (
    <>
      {isLightable ? (
        <>
          <h3>Backlight Settings</h3>
          <LightResponse
            group={group}
            project={project}
            setProject={setProject}
            configId={configId}
          />
          {eligibleLightStates.map((state: number) => {
            const color = group.colorForState(state);

            const stateStr = state === 0 ? 'off' : 'on';

            const innerColorChange = (value: string | number) => {
              onColorChange(value as string, state);
            };

            const innerFxChange = (value: string) => {
              onFxChange(value, state);
            };

            const innerFxValChange = (value: MidiNumber[]) => {
              onFxValChange(value, state);
            };

            return (
              <div key={state} id="backlight-config">
                <div className="settings-line color-setting">
                  <h5>State: {stateStr}</h5>
                </div>
                <div className="settings-line color-setting">
                  <p>Color:</p>
                  <div
                    className="color-sample"
                    style={{ backgroundColor: `${color ? color.string : ''}` }}
                  />
                  <BasicSelect
                    value={color ? colorDisplayName(color) : ''}
                    valueList={valueList}
                    labelList={labelList}
                    onChange={innerColorChange}
                  />
                </div>
                {group.eligibleFx?.length > 0 && color?.effectable === true ? (
                  <FXConfig
                    eligibleFx={group.eligibleFx}
                    activeFx={group.getActiveFx(state)}
                    fxVal={group.getFxVal(state)}
                    onFxChange={innerFxChange}
                    onFxValChange={innerFxValChange}
                  />
                ) : null}

                <div className="separator" />
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
}
