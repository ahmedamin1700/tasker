import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({ data: { ...input } });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUserByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateRefreshTokenHash(userId: number, refreshTokenHash: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  // async refreshToken(userId: number, refreshToken: string) {
  //   // const user = await this.findUserById(userId);
  //   // if (!user) throw new Error('no user exists with this id.');

  //   // const valid = await argon
  // }

  async deleteRefreshTokenHash(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: {
          not: null,
        },
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }
}
