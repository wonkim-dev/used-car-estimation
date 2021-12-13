import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _ascrypt } from 'crypto';
import { promisify } from 'util';

// Promisify scrypt function
const scrypt = promisify(_ascrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    // Throw an error if the email already exists.
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the passward together using scrypt
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);
    return user;
  }

  signin() {}
}
