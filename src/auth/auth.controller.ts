import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetRefreshToken, GetUser, Public } from './decorators';
import { CreateUserDto } from './dto';
import { LocalAuthGuard, RefreshAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() input: CreateUserDto) {
    try {
      return await this.authService.register(input);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@GetUser() user: User) {
    return await this.authService.login(user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@GetUser('user') user: User, @GetRefreshToken() token: string) {
    try {
      return await this.authService.refreshToken(user.id, token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(@GetUser() user: User) {
    return await this.authService.logout(user.id);
  }
}
