export type RootStackParamList = {
    Home: undefined;
    Cadastro: undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }