import type { MonoInteractiveDriver } from '../../../types';

import { ContinuousStateManager } from './continuous-state-manager';
import { GateStateManager } from './gate-state-manager';
import { StateManagerDTO } from './state-manager';
import { TriggerStateManager } from './trigger-state-manager';

export function createStateManagerFromDTO(
  driver: MonoInteractiveDriver,
  dto: StateManagerDTO,
) {
  if (dto.type === 'GateStateManager') return new GateStateManager(driver);
  if (dto.type === 'ContinuousStateManager')
    return new ContinuousStateManager();
  if (dto.type === 'TriggerStateManager')
    return new TriggerStateManager(
      dto.outputStrategy as 'toggle' | 'constant' | 'n-step',
    );

  throw new Error('');
}
