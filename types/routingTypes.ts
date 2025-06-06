import type { TaskTypes } from './taskTypes';

export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    ModalBiometria: undefined;
    MainTabs: undefined;
    Avatar: undefined;
    Theme: undefined;
    Terms: undefined;
    Tasks: { item: TaskTypes };
    Menu: undefined;
};
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }
