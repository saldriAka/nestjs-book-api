
import { User } from 'src/users/entity/users.entity';
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Book extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    category: string;

    @Column()
    year: number;

    @ManyToOne(() => User, (user) => user.books)
    user: User;
}