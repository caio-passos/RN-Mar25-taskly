export type RootStackParamList = {
    Home: undefined;
    Cadastro: undefined;
    ModalBiometria: undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }