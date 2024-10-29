import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { OverrideablePropagator } from './overrideable-propagator';

@Revivable.register
export class NonsequentialStepPropagator extends OverrideablePropagator<
  'constant',
  'constant'
> {
  defaultStep: NumberArrayWithStatus;

  protected steps: Map<string, MidiArray>;

  lastStep: NumberArrayWithStatus;

  constructor(
    status: StatusString | 'noteon/noteoff',
    channel: Channel,
    number: MidiNumber,
    steps: Map<string, MidiArray>,
    defaultStep: NumberArrayWithStatus,
  ) {
    super('constant', 'constant', status, number, channel);

    this.steps = steps;
    this.defaultStep = defaultStep;
    this.lastStep = defaultStep;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.statusString,
        this.channel,
        this.number,
        this.steps,
        this.defaultStep,
      ],
    };
  }

  protected getResponse(arr: MidiArray) {
    this.lastStep = arr.array as NumberArrayWithStatus;
    return this.steps.get(JSON.stringify(arr.array));
  }

  responseForStep(step: string | NumberArrayWithStatus) {
    const stepStr = typeof step === 'string' ? step : JSON.stringify(step);
    return this.steps.get(stepStr);
  }

  setStep(step: string | NumberArrayWithStatus, arr: MidiArray) {
    const stepStr = typeof step === 'string' ? step : JSON.stringify(step);
    this.steps.set(stepStr, arr);
  }

  /* Unused */
  nextEventType() {
    return 'controlchange' as const;
  }
}
