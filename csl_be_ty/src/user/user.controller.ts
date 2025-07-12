import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpException, UnauthorizedException, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Req, BadRequestException, NotFoundException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AttachmentDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { uuid } from 'uuidv4';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { ClientInfoUpdateRequest, ClientUpdateRequest, UpdateUserPasswordRequest, UpdateUserRequest } from './dto/updateUser.dto';
import { compare, hash } from 'bcryptjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { PaginationDto } from './dto/request.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('clients/:id/upload')
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: ImageFileFilter
    })
  )
  public async uploadFile(@Param('id', ParseIntPipe) id: number, @Body() body: AttachmentDto, @Req() req:any,
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File){
    if(!file || req.fileValidationError){
      throw new BadRequestException("Invalid file provided, [Image | pdf | doc files allowed]")
    }
    console.log(file);
    console.log(body.filename);
    
    
    // const category = await this.categoryService.findOneById(id)
    // if(!category) return new NotFoundException("Category not found")

    // if( category.url ){
    //   await this.uploadService.deleteCategoryImage(category.url)
    // }
    
    const buffer = file.buffer
    // const filename = `${uuid()}-${file.originalname.replace(/\s+/g,'')}`
    // const upload = await this.uploadService.addCategoryImage(buffer, filename) 
    
    // return this.categoryService.updateCategoryImage(id, filename) 
  }

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
  @Get("clients/shipping-marks")
  findShippingMarks() {
    return this.userService.findShippingMarks();
  }

  @UseGuards(JwtGuard)
  @Get("clients/:id")
  clientProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.clientProfile(id);
  }

  @UseGuards(JwtGuard)
  @Get("clients")
  findClients(@Query() pageOptionsDto:PageOptionsDto, @Query("search") search?: string) {
    return this.userService.findClients(pageOptionsDto, search);
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
  @Patch('clients/:id')
  async updateClient(@Param('id', ParseIntPipe) id: number, @Body() clientUpdateRequest: ClientUpdateRequest, @User() user:UserInfo) {
    const updated = await this.userService.updateClient(id, clientUpdateRequest.shippingMark, clientUpdateRequest.phone)
    const {password, ...result} = updated

    return {user: result ,message: "User password updated successfully"}
    // return
  }

  @UseGuards(JwtGuard)
  @Patch('clients/:id/info')
  async updateClientDetails(@Param('id', ParseIntPipe) id: number, @Body() clientUpdateRequest: ClientInfoUpdateRequest, @User() user:UserInfo) {
    const updated = await this.userService.updateClientDetails(id, clientUpdateRequest)
    const {password, ...result} = updated

    return {user: result ,message: "User details updated successfully"}
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

  @UseGuards(JwtGuard)
  @Patch('clients/password/:id')
  async updateClientPassword(@Param('id', ParseIntPipe) id: number, @Body() updateUserPasswordRequest: UpdateUserPasswordRequest, @User() user:UserInfo) {
    if(id !== user.sub.id) throw new UnauthorizedException()

    const updatedClient = await this.userService.findClientById(id)
    if(!updatedClient) throw new HttpException("User does not exist", 401)

    const isValidPassword = await compare(updateUserPasswordRequest.oldPassword, updatedClient.password)
    if(!isValidPassword) throw new HttpException("Old password does not match the existing password", 401)

    if(updateUserPasswordRequest.newPassword !== updateUserPasswordRequest.confirmPassword) throw new HttpException("New passwords do not match", 401)

    const hashedPassword = await hash(updateUserPasswordRequest.newPassword, 10)

    const updated = await this.userService.updateClientPassword(id, hashedPassword)
    const {password, ...result} = updated

    return {user: result ,message: "User password updated successfully"}
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
