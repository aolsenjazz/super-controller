/**
 * Not the most elegant way to load a bunch of drivers, but results in the
 * fastest development cycle
 */
import { DeviceDriver } from '../driver-types';

import { Device as Anonymous } from './anonymous';
import { Device as APCKey25Mk2Control } from './apc-key-25-mk2-control';
import { Device as APCKey25Mk2Keys } from './apc-key-25-mk2-keys';
import { Device as APCKey25 } from './apc-key-25';
import { Device as APCMini } from './apc-mini';
import { Device as ArturiaMiniLabMKII } from './arturia-minilab-mkii';
import { Device as Axiom49AxiomUSBIn } from './axiom-49-axiom-usb-in';
import { Device as DDM4000 } from './ddm4000';
import { Device as Fireface400Port1 } from './fireface-400-37-port-1';
import { Device as Fireface400Port2 } from './fireface-400-37-port-2';
import { Device as ImpactGX61Midi1 } from './impact-gx61-midi1';
import { Device as Impulse } from './impulse';
import { Device as IRigBlueBoard } from './irig-blueboard';
import { Device as JS10D0AABluetooth } from './js10d0aa-bluetooth';
import { Device as JS10D0AA } from './js10d0aa';
import { Device as Keystation61MK3Transport } from './keystation-61-mk3-transport';
import { Device as Keystation61Mk3UsbMidi } from './keystation-61-mk3-usb-midi';
import { Device as LaunchkeyMiniLKMiniInControl } from './launchkey-mini-lk-mini-incontrol';
import { Device as LaunchkeyMiniLKMiniMidi } from './launchkey-mini-lk-mini-midi';
import { Device as LaunchkeyMiniMK3DAW } from './launchkey-mini-mk3-daw-port';
import { Device as LaunchkeyMiniMK3MIDI } from './launchkey-mini-mk3-midi-port';
import { Device as LPK25 } from './lpk25';
import { Device as MixtrackProFX } from './mixtrack-pro-fx';
import { Device as MPKMini3 } from './mpk-mini-3';
import { Device as MPKMiniPlusPort1 } from './mpk-mini-plus-port-1';
import { Device as MPKMini2 } from './mpkmini2';
import { Device as UMONE } from './umone';
import { Device as USBUnoMIDI } from './usb-uno-midi-interface';

export const DRIVERS = (() => {
  const map = new Map<string, DeviceDriver>();

  map.set(Anonymous.name, Anonymous);
  map.set(APCKey25Mk2Control.name, APCKey25Mk2Control);
  map.set(APCKey25Mk2Keys.name, APCKey25Mk2Keys);
  map.set(APCKey25.name, APCKey25);
  map.set(APCMini.name, APCMini);
  map.set(ArturiaMiniLabMKII.name, ArturiaMiniLabMKII);
  map.set(Axiom49AxiomUSBIn.name, Axiom49AxiomUSBIn);
  map.set(DDM4000.name, DDM4000);
  map.set(Fireface400Port1.name, Fireface400Port1);
  map.set(Fireface400Port2.name, Fireface400Port2);
  map.set(ImpactGX61Midi1.name, ImpactGX61Midi1);
  map.set(Impulse.name, Impulse);
  map.set(IRigBlueBoard.name, IRigBlueBoard);
  map.set(JS10D0AABluetooth.name, JS10D0AABluetooth);
  map.set(JS10D0AA.name, JS10D0AA);
  map.set(Keystation61MK3Transport.name, Keystation61MK3Transport);
  map.set(Keystation61Mk3UsbMidi.name, Keystation61Mk3UsbMidi);
  map.set(LaunchkeyMiniLKMiniInControl.name, LaunchkeyMiniLKMiniInControl);
  map.set(LaunchkeyMiniMK3DAW.name, LaunchkeyMiniMK3DAW);
  map.set(LaunchkeyMiniMK3MIDI.name, LaunchkeyMiniMK3MIDI);
  map.set(LaunchkeyMiniLKMiniMidi.name, LaunchkeyMiniLKMiniMidi);
  map.set(LPK25.name, LPK25);
  map.set(MixtrackProFX.name, MixtrackProFX);
  map.set(MPKMini3.name, MPKMini3);
  map.set(MPKMiniPlusPort1.name, MPKMiniPlusPort1);
  map.set(MPKMini2.name, MPKMini2);
  map.set(UMONE.name, UMONE);
  map.set(USBUnoMIDI.name, USBUnoMIDI);

  return map;
})();

export function getAvailableDrivers() {
  return Array.from(DRIVERS.keys());
}

export function getDriver(portName: string) {
  let driverOrUndefined = DRIVERS.get(portName);

  if (driverOrUndefined === undefined) {
    driverOrUndefined = DRIVERS.get('Anonymous')!;
    driverOrUndefined = { ...driverOrUndefined, name: portName };
  }

  return driverOrUndefined;
}
