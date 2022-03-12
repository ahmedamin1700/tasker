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
import { GetUser } from './decorators';
import { CreateUserDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() input: CreateUserDto) {
    try {
      return await this.authService.register(input);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@GetUser() user: User) {
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  me(@GetUser() user: User) {
    delete user.password;
    return user;
  }
}
