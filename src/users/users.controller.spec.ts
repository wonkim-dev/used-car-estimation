import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'email@gmail.com',
          password: 'dd',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
    };
    fakeAuthService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('returns a list of users with the given email', async () => {
      const users = await controller.findAllUsers('asdf@gmail.com');

      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual('asdf@gmail.com');
    });
  });

  describe('findUser', () => {
    it('returns a single user with the given id', async () => {
      const user = await controller.findUser('1');

      expect(user).toBeDefined();
    });

    it('throws an error if user with given id is not found', async () => {
      fakeUsersService.findOne = () => null;

      await expect(controller.findUser('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
