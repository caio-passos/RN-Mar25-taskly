export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    ModalBiometria: undefined;
    MainApp: undefined;
    Inicio: undefined;
    Notifications: undefined;
    Menu: undefined;
    View: undefined;
    Avatar: undefined;
    Theme: undefined;
    Terms: undefined;
};
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }