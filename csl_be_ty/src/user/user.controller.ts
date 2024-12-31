import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { UpdateUserPasswordRequest, UpdateUserRequest } from './dto/updateUser.dto';
import { compare, hash } from 'bcryptjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserRequest: UpdateUserRequest, @User() user:UserInfo) {
    if(id !== user.sub.id) throw new UnauthorizedException()
      const updated = await this.userService.update(id, updateUserRequest.name, updateUserRequest.email)
    const {password, ...result} = updated

    return {user: result ,message: "User password updated successfully"}
    // return
  }

  @UseGuards(JwtGuard)
  @Patch('password/:id')
  async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updateUserPasswordRequest: UpdateUserPasswordRequest, @User() user:UserInfo) {
    // return this.userService.update(+id, updateUserDto);
    if(id !== user.sub.id) throw new UnauthorizedException()

    const updatedUser = await this.userService.findUserById(id)
    if(!updatedUser) throw new HttpException("User does not exist", 401)

    const isValidPassword = await compare(updateUserPasswordRequest.oldPassword, updatedUser.password)
    if(!isValidPassword) throw new HttpException("Old password does not match the existing password", 401)

    if(updateUserPasswordRequest.newPassword !== updateUserPasswordRequest.confirmPassword) throw new HttpException("New passwords do not match", 401)

    const hashedPassword = await hash(updateUserPasswordRequest.newPassword, 10)

    const updated = await this.userService.updateUserPassword(id, hashedPassword)
    const {password, ...result} = updated

    return {user: result ,message: "User password updated successfully"}
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
