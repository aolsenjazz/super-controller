import { BrowserWindow } from 'electron';

export type WindowFocusListener = (w: BrowserWindow | null) => void;
