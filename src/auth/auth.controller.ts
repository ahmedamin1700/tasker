import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { CreateUserDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() input: CreateUserDto) {
    const user = await this.authService.register(input);
    return user;
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
