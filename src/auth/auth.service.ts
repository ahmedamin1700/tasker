import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto';
import { Token } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private token: Token,
  ) {}

  async updateRefreshToken(userId: number, refreshToken: string) {
    const refreshTokenHash = await argon.hash(refreshToken);
    await this.userService.updateRefreshTokenHash(userId, refreshTokenHash);
  }

  async register(input: CreateUserDto) {
    let user = await this.userService.findUserByUsername(input.username);

    if (user) {
      throw new Error(`user already exists with username ${input.username}`);
    }

    const hashedPassword = await argon.hash(input.password);
    user = await this.userService.create({
      ...input,
      password: hashedPassword,
    });

    const tokens = await this.token.generateTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
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
    const tokens = await this.token.generateTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    return await this.userService.deleteRefreshTokenHash(userId);
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findUserById(userId);

    if (!user) throw new Error('no user exists with this id');

    let valid: boolean;

    try {
      valid = await argon.verify(user.refreshTokenHash, refreshToken);
    } catch (error) {
      throw new Error('something wrong with the token.');
    }

    if (!valid) throw new Error('something wrong with the token.');

    const tokens = await this.token.generateTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
}
