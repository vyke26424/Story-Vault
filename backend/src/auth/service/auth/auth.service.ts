import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Register, SignIn, } from 'src/interface/dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import * as config_1 from '@nestjs/config';
import{ StringValue,} from 'ms';
import ms from 'ms'

@Injectable()
export class AuthService {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly config : config_1.ConfigType<typeof jwtConfig>,
        private readonly prisma: PrismaService,
        private readonly jwtService : JwtService,
        
    ){}
    async register(dto : Register, device : string) {
        const isExists = await this.prisma.user.findUnique({
            where : {email : dto.email}
        });
        if(isExists) {
            throw new BadRequestException('Email đã tồn tại, hãy tạo một email mới ')
        }
        const hashedPassword = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data : {
                ...dto, password : hashedPassword
            }
        });
        const {accessToken, refreshToken} = await this.generateToken(user.id, user.role, device);

        const {password, ...inforUser} = user;

        return {
            accessToken,
            refreshToken,
            user : inforUser
        }
    }

    async signIn (data : SignIn, device : string){
        const user = await this.prisma.user.findUnique({
            where : {email : data.email}
        });
        if(!user) {
            throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
        }
        const isMatch = await argon2.verify(user.password, data.password);
        if(!isMatch) {
            throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
        }
        const {accessToken, refreshToken} = await this.generateToken(user.id, user.role, device);
        const {password, ...userWithoutPass} = user;
        return {
            accessToken : accessToken,
            refreshToken,
            user : userWithoutPass
        }
    }

    async logOut (refreshToken : string){
        if(!refreshToken) {
            throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
        }
        const payload : {jti : string} = await this.jwtService.verifyAsync(refreshToken,{
            secret : this.config.jwt_refresh
        });
        const isExists = await this.prisma.refreshToken.findUnique({
            where : {id : payload.jti}
        })
        
        if(!isExists) {
            throw new UnauthorizedException('Phiên đăng nhập không hợp lệ')
        }
        await this.prisma.refreshToken.delete({
            where : {id : payload.jti}
        });

    }

    async refresh(refreshToken : string, device : string){
        if(!refreshToken) {
            throw new UnauthorizedException('Không tìm thấy refresh-token');
        }
        const payload = await this.jwtService.verifyAsync(refreshToken,{
            secret : this.config.jwt_refresh
        });
        if(!payload) {
            throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
        }
        const isExists = await this.prisma.refreshToken.findUnique({
            where : {id : payload.jti}
        });
        if(!isExists) {
            throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
        }
        const {accessToken, refreshToken : newRefreshToken} =  await this.generateToken(payload.userId, payload.role, device);
        return {
            accessToken,
            newRefreshToken
        }
    }

    async generateToken (userId : string, role : string, device : string) {
        const accessToken = await this.jwtService.signAsync(
            {
                sub : userId,
                role : role
            },
            {
                expiresIn : this.config.jwt_secret_expires as StringValue,
            }
        );
        const jti = crypto.randomUUID();
        const refreshToken = await this.jwtService.signAsync(
            {
                userId, role, jti
            },
            {
                expiresIn : this.config.jwt_refresh_expires as StringValue,
                secret : this.config.jwt_refresh
            }
        );
        await this.prisma.refreshToken.create({
            data : {
                id : jti,
                userId,
                device ,
                expiresAt : new Date(Date.now() + ms(this.config.jwt_refresh_expires as StringValue))
            }
        })
        return {
            accessToken,
            refreshToken
        }
    }
}
