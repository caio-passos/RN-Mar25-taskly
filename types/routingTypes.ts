export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    ModalBiometria: undefined;
    MainApp: undefined;
    Dashboard: undefined;

  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }