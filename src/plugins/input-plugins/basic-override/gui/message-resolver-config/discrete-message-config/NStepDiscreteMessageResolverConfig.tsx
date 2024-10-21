import { DiscreteMessageResolverDTO } from '@plugins/input-plugins/basic-override/message-resolver/discrete-message-resolver';
import { useEffect, useState } from 'react';

import StepConfig from './step-config/StepConfig';

type PropTypes = {
  resolver: DiscreteMessageResolverDTO;
  onChange: (state: number, binding: NumberArrayWithStatus) => void;
  onAdd: (state: number, binding: NumberArrayWithStatus) => void;
  onDelete: (state: number) => void;
};

export default function NStepDiscreteMessageResolverConfig(props: PropTypes) {
  const { resolver, onChange, onAdd, onDelete } = props;
  const { bindings, defaults, eligibleStatuses } = resolver;

  const nSteps = Object.keys(bindings).length;
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
      onAdd(newStep, defaults[0]);
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
      <label>
        Step:
        <select
          value={step}
          onChange={(e) => onOptionClick(Number(e.target.value))}
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
      </label>
      <StepConfig
        bindingMsg={bindings[step]}
        defaultMsg={defaults[step]}
        eligibleStatuses={eligibleStatuses}
        onChange={(binding) => onChange(step, binding)}
      />
    </>
  );
}
