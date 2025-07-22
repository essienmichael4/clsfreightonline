import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/user/entities/client.entity';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ForgottenPasswordDto, ResetPasswordDto } from './dto/register.dto';
import { ClientAuthReponse } from './dto/response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface SignupParams{
    email:string
    name: string
    password: string
    role: Role
}

interface ClientSignupParams{
    email:string
    password: string
    shippingMark: string,
    phone: string
}

interface PayloadParams{
    email: string,
    sub: {
        id: number,
        name?: string
    }
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepo:Repository<User>, 
        @InjectRepository(Client) private readonly clientRepo:Repository<Client>, 
        private userService: UserService,
        private jwtService:JwtService,
        private eventEmitter:EventEmitter2
    ){}

    async findUser(email:string){
        return await this.userService.findUserByEmail(email)
    }

    async findClient(email:string){
        return await this.userService.findClientByEmail(email)
    }

    async register({name, email, password, role}:SignupParams){
        const user = await this.userService.create({email, name, password, role})
        return user
    }

    async registerClient({email, password,shippingMark, phone}:ClientSignupParams){
        const user = await this.userService.createClient({email, password, shippingMark, phone})
        return user
    }

    async signAuthPayload(payload:PayloadParams){
        return this.jwtService.sign(payload, {
            expiresIn: "1h",
            secret: process.env.JWT_SECRET_KEY
        })
    }

    async resignAuthPayload(payload:PayloadParams){
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY
        })
    }

    async signRefreshPayload(payload:PayloadParams){
        return this.jwtService.sign(payload, {
            expiresIn: "7d",
            secret: process.env.JWT_REFRESH_KEY
        })
    }

    async signResetPasswordPayload(payload:PayloadParams, time: string){
        return await this.jwtService.sign(payload, {
            expiresIn: time,
            secret: process.env.JWT_SECRET_KEY
        })
    }

    async forgotClientPassword(forgottenPasswordDto:ForgottenPasswordDto){
        try{
            const userExists = await this.findClient(forgottenPasswordDto.email)
            if(!userExists) throw new HttpException("The account does not exist on this platform", 401)

            const user = new ClientAuthReponse(userExists)

            const payload = {
                email: user.email,
                sub: {
                    id: user.id,
                    name: user.name,
                }
            }

            const signedId = await this.signResetPasswordPayload(payload, '30m')

            const link = `https://cslfreightgh.com/reset-password?id=${signedId}&email=${user.email}`
            // const link = `https://localhost:5137/reset-password?id=${signedId}&email=${user.email}`

            
            this.eventEmitter.emit("reset.password", {email: user.email, name: user.name, link})

            return ({message: "Password reset request has been submitted successfully. A link has been sent to the email account provided to reset your password."})
        
        }catch(err){
            throw err
        }
    }

    async resetClientPassword(resetPasswordDto:ResetPasswordDto){
        try{            
            const payload = this.jwtService.verify(resetPasswordDto.id, {
                secret: process.env.JWT_SECRET_KEY
            })

            if(resetPasswordDto.email !== payload.email) throw new UnauthorizedException("The reset does not belong to the current email")
            const userExists = await this.findClient(resetPasswordDto.email)
            if(!userExists) throw new HttpException("The account does not exist on this platform", 401)

            if(resetPasswordDto.password !== resetPasswordDto.confirmPassword) throw new HttpException("Passwords do not match", 401)

            const reset = await this.userService.resetClientPassword(userExists.id, resetPasswordDto.password)
            return {message: "Password reset successful. Please login."}
        }catch(err){
            throw new Error(err)
        }
    }
}
