import { Color } from '@shared/driver-types/color';
import { FxDriver } from '@shared/driver-types/fx-driver';
import { useEffect, useState } from 'react';
import { BacklightControlDTO } from '..';
import ColorSelect from './ColorSelect';
import FxSelect from './FxSelect';

function getDefault(availableColors: Color[]) {
  return availableColors.find((c) => c.default === true)!;
}

type PropTypes = {
  colorBindings: BacklightControlDTO['colorBindings'];
  fxBindings: BacklightControlDTO['fxBindings'];
  fxValueBindings: BacklightControlDTO['fxValueBindings'];
  availableColors: BacklightControlDTO['availableColors'];
  availableFx: BacklightControlDTO['availableFx'];
  onColorChange: (n: number, c: Color) => void;
  onFxChange: (state: number, fx: FxDriver) => void;
  onFxValueChange: (state: number, arr: MidiNumber[]) => void;
  onDelete: (state: number) => void;
  onAdd: (state: number, color: Color) => void;
};

export default function NStepColorSelect(props: PropTypes) {
  const {
    colorBindings,
    availableColors,
    availableFx,
    fxBindings,
    fxValueBindings,
    onColorChange,
    onFxChange,
    onFxValueChange,
    onDelete,
    onAdd,
  } = props;

  const nSteps = Object.keys(colorBindings).length;
  const steps = Array.from(Array(nSteps).keys());

  const [step, setStep] = useState(0);
  const [expectedNSteps, setExpectedNSteps] = useState(0);

  const AddStep = (
    <option value={nSteps} key={nSteps}>
      Add step...
    </option>
  );

  const DeleteStep = (
    <option value={nSteps + 1} key={nSteps + 1}>
      Delete step {nSteps}...
    </option>
  );

  const onOptionClick = (newStep: number) => {
    if (newStep === nSteps) {
      // add new step with default color
      onAdd(newStep, getDefault(availableColors));
      setExpectedNSteps(nSteps + 1);
    } else if (newStep === nSteps + 1) {
      if (step === nSteps - 1) setStep(step - 1);

      onDelete(nSteps - 1);
    } else {
      setStep(newStep);
    }
  };

  useEffect(() => {
    if (expectedNSteps === nSteps) {
      setStep(nSteps - 1);
    }
  }, [nSteps, expectedNSteps]);

  return (
    <>
      <select
        value={step}
        onChange={(e) => onOptionClick(Number(e.target.value))}
        className="step-selector"
      >
        {steps.map((s) => {
          return (
            <option key={s} value={s}>
              Step {s + 1}
            </option>
          );
        })}
        {AddStep}
        {nSteps > 1 && DeleteStep}
      </select>
      <ColorSelect
        availableColors={availableColors}
        onChange={onColorChange}
        state={step}
        color={colorBindings[step]}
      />
      {colorBindings[step]?.effectable && (
        <FxSelect
          availableFx={availableFx}
          activeFx={fxBindings[step]}
          fxValueArr={fxValueBindings[step]}
          onFxChange={onFxChange}
          onFxValueChange={onFxValueChange}
          state={step}
        />
      )}
    </>
  );
}
