import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from 'src/users/entity/users.entity';

@Entity()
export class RefreshToken extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isRevoked: boolean;

    @Column()
    expiredAt: Date;

    @ManyToOne(() => User, (user) => user.refreshToken)
    user: User;
}