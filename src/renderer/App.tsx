import { DeviceProvider } from '@context/selected-device-context';
import { SelectedInputsProvider } from '@context/selected-inputs-context';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';

import './styles/App.global.css';

// TODO: document this. what exactly is this doing?
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
