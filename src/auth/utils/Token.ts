import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Token {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async generateTokens(userId: number, username: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(
        { sub: userId, username },
        { expiresIn: 60 * 15, secret: this.config.get('ACCESS_TOKEN_SECRET') },
      ),
      this.jwtService.sign(
        { sub: userId, username },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.config.get('REFRESH_TOKEN_SECRET'),
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
