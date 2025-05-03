export interface UserDataTypes {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  checkSenha?: string;
  loggedIn?: boolean;
  avatar?: string;
}