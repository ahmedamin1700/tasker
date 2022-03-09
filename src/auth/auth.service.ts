import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { CreateUserDto } from './dto';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(input: CreateUserDto) {
    let user = await this.userService.findUserByUsername(input.username);
    console.log(user);

    if (user) {
      throw new Error(`user already exists with username ${input.username}`);
    }

    const hashedPassword = await argon.hash(input.password);
    user = await this.userService.create({
      ...input,
      password: hashedPassword,
    });
    return user;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);

    if (user && (await argon.verify(user.password, password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
