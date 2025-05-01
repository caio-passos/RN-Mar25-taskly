export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    ModalBiometria: undefined;
    MainApp: undefined;
    Dashboard: undefined;
    Notifications: undefined;
    Menu: undefined;
    View: undefined;
    Avatar: undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }