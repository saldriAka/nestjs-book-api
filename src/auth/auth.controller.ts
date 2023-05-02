import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interface/login.response.interface';
import { RefreshAccessTokenDto } from './dto/refresh.token.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { GetUser } from './get-user.decorator';
import { User } from 'src/users/entity/users.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.login(loginDto);
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshAccessTokenDto): Promise<{ access_token: string }>{
        return this.authService.refreshAccessToken(refreshTokenDto);
    }

    @Patch('/:id/revoke')
    @UseGuards(JwtGuard)
    async revokeRefreshToken(@Param('id') id: string): Promise<void>{
        return this.authService.revokeRefreshToken(id);
    }

}
