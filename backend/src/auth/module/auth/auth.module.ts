import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { AuthController } from 'src/auth/controller/auth/auth.controller';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
    imports : [
        JwtModule.registerAsync({
            useFactory : (config : ConfigType <typeof jwtConfig>) => 
            ({
                secret : config.jwt_secret ,
            }),
            inject : [jwtConfig.KEY]
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
