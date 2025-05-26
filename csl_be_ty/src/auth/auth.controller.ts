import { Body, ConflictException, Controller, Get, HttpException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {compare, hash} from 'bcryptjs'
import { UserSignUpRequest } from './dto/register.dto';
import { UserAuthReponse } from './dto/response.dto';
import { UserSignInRequest } from './dto/signin.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { RefreshJwtGuard } from 'src/guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() body:UserSignUpRequest){
    const userExists = await this.authService.findUser(body.email)
    if(userExists) throw new ConflictException("Email already exists")
    
    const hashedPassword = await hash(process.env.ADMIN_PASSWORD, 10)

    const createUser = await this.authService.register({name: body.name, email: body.email, password: hashedPassword, role: body.role})
    const {password, ...result} = createUser
    const user = new UserAuthReponse(result)

    return {user ,message: "User created successfully"}
  }

  @Post("signin")
  async signin(@Body() body:UserSignInRequest){
    const userExists = await this.authService.findUser(body.email)
    if(!userExists) throw new HttpException("Invalid credentials", 401)

    const isValidPassword = await compare(body.password, userExists.password)
    if(!isValidPassword) throw new HttpException("Invalid credentials", 401)

    const {password, ...result} = userExists
    
    const user = new UserAuthReponse(result)

    const payload = {
      username: user.email,
      sub: {
          id: user.id,
          name: user.name
      }
    }

    return {
      user,
      backendTokens: {
          accessToken: await this.authService.signAuthPayload(payload),
          refreshToken: await this.authService.signRefreshPayload(payload)
      }
    }
  }

  @UseGuards(RefreshJwtGuard)
  @Get("refresh")
  async refreshToken(@User() req:UserInfo){

    const accessToken =  await {accessToken: await this.authService.resignAuthPayload(req)}
    
    return accessToken
  }
}
