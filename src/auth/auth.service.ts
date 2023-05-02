import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interface/login.response.interface';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenRepository } from './repository/refresh.token.repository';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { RefreshAccessTokenDto } from './dto/refresh.token.dto';
import { TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        @InjectRepository(RefreshTokenRepository)
        private readonly refreshTokenRepository: RefreshTokenRepository
    ){}

    async login(loginDto: LoginDto): Promise<LoginResponse>{
        const { email, password} = loginDto;

        const user = await this.userService.validateUser(email, password);

        if(!user){
            throw new UnauthorizedException('Wrong email or password');
        }

        const access_token  = await this.createAccessToken(user);
        const refresh_token = await this.createRefreshToken(user); 
       
        return {access_token, refresh_token} as LoginResponse;

    }

    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<{ access_token: string }>{
        const { refresh_token } = refreshAccessTokenDto;

        const payload = await this.decodeToken(refresh_token);
        console.log(payload);
        const refreshToken = await this.refreshTokenRepository.findOne({
            where:{
                id: payload.jid
            },
            relations: ['user'],
        });

        if(!refreshToken){
            throw new UnauthorizedException('Refresh token not found');
        }

        if(refreshToken.isRevoked){
            throw new UnauthorizedException('Refresh token has been Revoked');
        }

        const access_token = await this.createAccessToken(refreshToken.user);

        return { access_token };
    }

    async decodeToken(token: string): Promise<any>{
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (e) {
            if(e instanceof TokenExpiredError){
                throw new UnauthorizedException('Refresh Token is expired');
            }else{
                throw new InternalServerErrorException('Failed to decode token');
            }
        }
    }

    async createAccessToken(user: User): Promise<string>{
        const payload = {
            sub: user.id,
        };
        const access_token = await this.jwtService.signAsync(payload);
        return access_token;
    }

    async createRefreshToken(user: User): Promise<string>{
        const refreshToken = await this.refreshTokenRepository.createRefreshToken(
            user,
            +refreshTokenConfig.expiresIn,
        );

        const payload = { 
            jid: refreshToken.id,
        };

        const refresh_token = await this.jwtService.signAsync(payload, refreshTokenConfig);
        
        return refresh_token;
    }

    async revokeRefreshToken(id: string): Promise<void>{
        const refreshToken = await this.refreshTokenRepository.findOneBy({ id });

        if(!refreshToken){
            throw new NotFoundException('Refresh token is not found');
        }

        refreshToken.isRevoked = true;
        await refreshToken.save();
    }
}
