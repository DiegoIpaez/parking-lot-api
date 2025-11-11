import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { paginationFormatter } from '@/utils/pagination/pagination.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  }

  async findAll(query: FindUsersDto) {
    const { page, limit } = query;
    const whereClause: Prisma.UserWhereInput = {};

    if (query.role) whereClause.role = query.role;
    if (query.email) {
      whereClause.email = { contains: query.email, mode: 'insensitive' };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      omit: { password: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const totalUsers = await this.prisma.user.count({ where: whereClause });

    return paginationFormatter<Omit<User, 'password'>>({
      page,
      limit,
      data: users,
      totalRecords: totalUsers,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const dataToUpdate = { ...updateUserDto };

    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      omit: { password: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      omit: { password: true },
    });
  }
}
