import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { RefreshToken } from '../entity/refresh.token.entity'
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken>
{
    constructor(private dataSource: DataSource)
    {
        super(RefreshToken, dataSource.createEntityManager());
    }

    async createRefreshToken(user: User, ttl: number): Promise<RefreshToken>{
        const refreshToken          = this.create();
        refreshToken.user           = user;
        refreshToken.isRevoked      = false;
        const expiredAt             =  new Date();
        expiredAt.setTime(expiredAt.getTime() + ttl);
        refreshToken.expiredAt      = expiredAt;

        return await refreshToken.save(); 
    }
}
