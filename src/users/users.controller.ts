import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StaffGuard } from '@/guards/staff.guard';
import { UserGuard } from '@/guards/user.guard';
import { ServerResponse } from '../utils';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/dto/users/update-user.dto';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly userServices: UsersService) {}

  @Post('')
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create user',
  })
  async store(@Body() body: CreateUserDto) {
    try {
      await this.userServices.store(body);
      return new ServerResponse(201, 'Successfully created user');
    } catch (err: any) {
      this.logger.error(`Failed to store user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully update user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update user',
  })
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: 'Update user with id' })
  async update(@Body() body: UpdateUserDto, @Param('id') id: string) {
    try {
      await this.userServices.update(id, body);
      return new ServerResponse(201, 'Successfully updated user');
    } catch (err: any) {
      this.logger.error(`Failed to update user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully update user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update user',
  })
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Update user' })
  async selfUpdate(@Body() body: UpdateUserDto, @Req() req) {
    try {
      const { userId } = req.user;
      await this.userServices.update(userId, body);
      return new ServerResponse(201, 'Successfully updated');
    } catch (err: any) {
      this.logger.error(`Failed to update user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
