<<<<<<< HEAD
import { v4 as uuidv4 } from 'uuid';

export interface UserDataTypes {
  uid: uuidv4;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  checkSenha?: string;
  loggedIn?: boolean;
  avatar?: string;
=======
export interface UserData {
  nome: string;
  email: string;
  telefone: number;
  senha: string;
>>>>>>> develop
}