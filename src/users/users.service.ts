import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  // repo: an instance of TypeORM Repository that deals with instance of User.
  // DI system does not work properly with generic, so InjectRepository decorator is
  // required to specify that generic type (User) is used in DI.
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // Hookes defined in entity are executed with create() method.
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }
}
