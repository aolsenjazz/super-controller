import { selectProjectName } from '@features/project-name/project-name-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import DrawerToggles from './DrawerToggles';

/**
 * On mac, stoplight controls are overlaid over this draggable title bar
 */
export default function TitleBar() {
  const projectName = useAppSelector(selectProjectName);

  return (
    <div id="title-bar">
      <div id="drag-region">
        <div id="no-shadow" />
        <h1 id="title">{projectName}</h1>
        <div id="shadow" />
      </div>
      <DrawerToggles />
    </div>
  );
}
