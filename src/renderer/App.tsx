import { DeviceProvider } from '@context/selected-device-context';
import { SelectedInputsProvider } from '@context/selected-inputs-context';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';

import './styles/App.global.css';

/**
 * When dragging a file over a chrome window, normally the cursor will change to indicate
 * that the file can be dropped into chrome and be interpreted (e.g. a picture would be read)
 * and displayed. We do not want this behavior to exist, so prevent the default.
 */
document.body.ondragover = (event) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  event.preventDefault();
};

export default function App() {
  return (
    <DeviceProvider>
      <SelectedInputsProvider>
        <TitleBar />
        <div id="main-content">
          <DeviceList />
          <DevicePanel />
          <ConfigPanel />
        </div>
      </SelectedInputsProvider>
    </DeviceProvider>
  );
}
