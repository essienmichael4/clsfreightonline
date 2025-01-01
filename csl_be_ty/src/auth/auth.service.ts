import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

interface SignupParams{
    email:string
    name: string
    password: string
    role: Role
}
interface PayloadParams{
    username: string,
    sub: {
        id: number,
        name: string
    }
}

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) 
        private readonly userRepo:Repository<User>, 
        private userService: UserService,
        private jwtService:JwtService
    ){}

    async findUser(email:string){
        return await this.userService.findUserByEmail(email)
    }

    async register({name, email, password, role}:SignupParams){
        const user = await this.userService.create({email, name, password, role})
        return user
    }

    async signAuthPayload(payload:PayloadParams){
        return this.jwtService.sign(payload, {
            expiresIn: "1h",
            secret: process.env.JWT_SECRET_KEY
        })
    }

    async signRefreshPayload(payload:PayloadParams){
        return this.jwtService.sign(payload, {
            expiresIn: "7d",
            secret: process.env.JWT_REFRESH_KEY
        })
    }
}
