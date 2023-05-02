import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  imports: [TypeOrmModule.forFeature([UserRepository])],
  exports: [UsersService]
})
export class UsersModule {}
