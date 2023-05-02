import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Post()
    async createUser(@Body() payload: CreateUserDto): Promise<void>{
        return this.userService.createUser(payload);
    }

}
