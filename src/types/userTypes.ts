export interface AvatarData {
  id: number;
  uri: number | string;
  borderColor: string;
}
export interface UserDataTypes {
  uid: string;
  name: string; 
  email: string;
  phone_number: string; 
  password: string; 
  checkSenha?: string;
  loggedIn?: boolean;
  avatar?: AvatarData;
  theme?: boolean;
}

export interface UserTypes extends UserDataTypes {
  id: string;
}
