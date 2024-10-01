// Se você tem uma interface para o usuário, importe-a aqui.
// Por exemplo, se você tiver o modelo do usuário, importe a interface abaixo:

import { User } from '../models/userModel'; // Ajuste o caminho para o modelo do seu User

// Estendendo a interface Request para incluir a propriedade `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: User; // Propriedade opcional do tipo `User`, ajuste conforme a interface de seu modelo
  }
}
