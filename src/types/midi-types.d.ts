declare type StatusString =
  | 'noteon'
  | 'noteoff'
  | 'keypressure'
  | 'controlchange'
  | 'programchange'
  | 'channelpressure'
  | 'pitchbend'
  | 'unknown';

declare type Channel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;
