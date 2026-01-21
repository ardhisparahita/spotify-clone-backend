import { Request } from 'express';
import { Role } from 'src/users/enum/role.enum';

export interface UserPayload {
  id: string;
  email?: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
