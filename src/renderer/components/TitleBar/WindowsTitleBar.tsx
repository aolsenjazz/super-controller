import { selectProjectName } from '@features/project-name/project-name-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';

/**
 * On Windows, don't show an additional title bar because we use the native one.
 */
export default function WindowsTitleBar() {
  const projectName = useAppSelector(selectProjectName);

  return <title>{projectName}</title>;
}
