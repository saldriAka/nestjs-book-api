import { EntityRepository, Repository, DataSource } from 'typeorm'
import { InternalServerErrorException, Injectable, ConflictException } from '@nestjs/common';
import { User } from '../entity/users.entity'
import { CreateUserDto } from '../dto/users.dto'
import * as bcrypt  from 'bcrypt'

@Injectable()
export class UserRepository extends Repository<User>
{
    constructor(private dataSource: DataSource)
    {
        super(User, dataSource.createEntityManager());
    }

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        const { name, email, password } = createUserDto;

        const user      = this.create();
        user.name       = name;
        user.email      = email;
        user.salt       = await bcrypt.genSalt();
        user.password   = await bcrypt.hash(password, user.salt);

        try {
            await user.save();
        } catch (e) {
            if(e.code == 'ER_DUP_ENTRY'){
                throw new ConflictException(`Email ${email} already used`);
            }else{
                throw new InternalServerErrorException(e);
            }
        }
    }

    async validateUser(email: string, password: string): Promise<User>{
        const user = await this.findOneBy({ email });

        if(user && (await user.validatePassword(password))){
            return user;
        }
        return null;
    }
}