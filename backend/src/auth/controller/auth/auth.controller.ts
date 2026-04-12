import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { Register, SignIn } from 'src/interface/dtos/auth.dto';
import { Response, Request} from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    async register(
        @Body() dto: Register,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request
    ) {
        const device = req.headers['user-agent']|| 'unknow';
        const data = await this.authService.register(dto, device);
        res.cookie('refreshToken', data.refreshToken,
            {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )
        return {
            access_token: data.accessToken,
            user: data.user
        }
    }
    @Post('signin')
    async signIn(
        @Body() dto: SignIn,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request
    ) {
        const device = req.headers['user-agent'] || 'unknow'
        const data = await this.authService.signIn(dto, device);
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return {
            accessToken: data.accessToken,
            user: data.user
        }
    }
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req.cookies['refreshToken'];
        res.clearCookie('refreshToken');
        return await this.authService.logOut(refreshToken);
    }

    @Post('refresh')
    async refresh(
        @Req() req : Request,
        @Res({passthrough : true}) res : Response
    ){
        const refreshToken = req.cookies['refreshToken'];
        const device =  req.header['user-agent'];
        const data =  await this.authService.refresh(refreshToken, device);
        res.cookie('refreshToken', data.newRefreshToken,{
            httpOnly : true,
            secure : false,
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
        return {
            newAccessToken : data.accessToken
        }
    }
}
