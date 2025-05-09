import { getThemedIcon, IconName } from '../services/IconService';

export const useIcon = (iconNames: IconName[], darkMode?: boolean) => {
  const icons = {} as Record<IconName, ReturnType<typeof getThemedIcon>>;
  
  iconNames.forEach(name => {
    icons[name] = getThemedIcon(name, darkMode);
  });

  return icons;
};
