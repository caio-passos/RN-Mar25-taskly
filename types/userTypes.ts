import { v4 as uuidv4 } from 'uuid';

export interface AvatarData {
  id: number;
  uri: number | string;
  borderColor: string;
}
export interface UserDataTypes {
  uid: typeof uuidv4;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  checkSenha?: string;
  loggedIn?: boolean;
  avatar?: AvatarData;
  theme?: boolean;
}