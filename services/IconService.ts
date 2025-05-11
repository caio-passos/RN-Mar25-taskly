import { useUserStore } from '../services/cache/stores/storeZustand';

import IconEditYellow from '../assets/icons/darkmode/pencilyellowdarkmode.svg'
import IconGreenArrow from '../assets/icons/lightmode/ArrowCircleRight.svg';
// Light mode icons
import IconTrashLight from '../assets/icons/lightmode/trash.svg';
import IconEditLight from '../assets/icons/lightmode/pencil.svg';
import IconCheckboxUncheckedLight from '../assets/icons/lightmode/uncheckedcircle.svg';
import IconCheckboxCheckedLight from '../assets/icons/lightmode/checkedcircle.svg';
import IconNoTasks from '../assets/icons/darkmode/nocontent.svg';
import IconFilterLight from '../assets/icons/lightmode/filter.svg';


// Dark mode icons
import IconTrashDark from '../assets/icons/darkmode/trashdarkmode.svg';
import IconEditDark from '../assets/icons/darkmode/pencildarkmode.svg';
import IconCheckboxUncheckedDark from '../assets/icons/lightmode/uncheckedcircle.svg';
import IconCheckboxCheckedDark from '../assets/icons/lightmode/checkedcircle.svg';
import IconFilterDark from '../assets/icons/lightmode/filter.svg';

type IconRegistry = {
  trash: React.ComponentType<{width?: number, height?: number}>;
  edit: React.ComponentType<{width?: number, height?: number}>;
  editYellow: React.ComponentType<{width?: number, height?: number}>;
  checkboxUnchecked: React.ComponentType<{width?: number, height?: number}>;
  checkboxChecked: React.ComponentType<{width?: number, height?: number}>;
  noTasks: React.ComponentType<{width?: number, height?: number}>;
  filter: React.ComponentType<{width?: number, height?: number}>;
  greenArrow: React.ComponentType<{width?: number, height?: number}>;

};

const iconRegistry = {
  trash: {
    light: IconTrashLight,
    dark: IconTrashDark
  },
  edit: {
    light: IconEditLight,
    dark: IconEditDark
  },
  editYellow: {
    light: IconEditYellow,
    dark: IconEditYellow
  },
  checkboxUnchecked: {
    light: IconCheckboxUncheckedLight,
    dark: IconCheckboxUncheckedDark
  },
  checkboxChecked: {
    light: IconCheckboxCheckedLight,
    dark: IconCheckboxCheckedDark
  },
  noTasks: {
    light: IconNoTasks,
    dark: IconNoTasks
  },
  filter: {
    light: IconFilterLight,
    dark: IconFilterDark
  },
  greenArrow:{
    light: IconGreenArrow,
    dark: IconGreenArrow
  }
} satisfies Record<string, {light: React.ComponentType, dark: React.ComponentType}>;

export const getThemedIcon = (iconName: keyof typeof iconRegistry, isDarkMode?: boolean) => {

  return iconRegistry[iconName][isDarkMode ? 'dark' : 'light'];
};

export type IconName = keyof typeof iconRegistry;
