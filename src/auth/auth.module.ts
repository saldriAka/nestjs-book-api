import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenRepository } from './repository/refresh.token.repository';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register(jwtConfig), 
    TypeOrmModule.forFeature([RefreshTokenRepository]),
    UsersModule,
  ],
  providers: [AuthService, RefreshTokenRepository, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
