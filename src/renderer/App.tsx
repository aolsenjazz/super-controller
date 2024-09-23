import { DeviceProvider } from '@context/selected-device-context';
import { SelectedInputsProvider } from '@context/selected-inputs-context';
import { PanelProvider } from '@context/panel-context';
import { SelectedInputConfigsProvider } from '@context/selected-input-configs-context';
import { SelectedPluginProvider } from '@context/selected-plugin-context';

import TitleBar from './components/TitleBar';

import './styles/App.global.css';
import MainContent from './components/MainContent';

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
    <PanelProvider>
      <DeviceProvider>
        <SelectedInputsProvider>
          <SelectedInputConfigsProvider>
            <SelectedPluginProvider>
              <TitleBar />
              <MainContent />
            </SelectedPluginProvider>
          </SelectedInputConfigsProvider>
        </SelectedInputsProvider>
      </DeviceProvider>
    </PanelProvider>
  );
}
