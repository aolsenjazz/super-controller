import { Provider } from 'react-redux';

import { PanelProvider } from '@context/panel-context';
import { SelectedPluginProvider } from '@context/selected-plugin-context';
import { store } from './store/store';

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
    <Provider store={store}>
      <PanelProvider>
        <SelectedPluginProvider>
          <TitleBar />
          <MainContent />
          <div id="modal-layer" />
        </SelectedPluginProvider>
      </PanelProvider>
    </Provider>
  );
}
