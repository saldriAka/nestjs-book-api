import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { EntityRepository, Repository, DataSource } from 'typeorm';
import { FilterBookDto } from '../dto/filterBook.dto'
import { Book } from '../entity/book.entity';
import { CreateBookDto } from '../dto/createbook.dto';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class BookRepository extends Repository<Book>
{
    constructor(private dataSource: DataSource)
    {
        super(Book, dataSource.createEntityManager());
    }

    async getBooks(user: User, filter: FilterBookDto): Promise<Book[]> {
        const { title, author, category, min_year, max_year } = filter;

        const query = this.createQueryBuilder('book')
                            .where('book.userId = :userId', { userId: user.id });
        if (title) {
        query.andWhere('lower(book.title) LIKE :title', {
            title: `%${title.toLowerCase()}%`,
        });
        }

        if (author) {
        query.andWhere('lower(book.author) LIKE :author', {
            author: `%${author.toLowerCase()}`,
        });
        }

        if (category) {
        query.andWhere('lower(book.category) LIKE :category', {
            category: `%${category.toLowerCase()}`,
        });
        }

        if (min_year) {
        query.andWhere('book.year >= :min_year', { min_year });
        }

        if (max_year) {
        query.andWhere('book.year <= :max_year', { max_year });
        }

        return await query.getMany();
    }

    async createBook(user: User, createBookDto: CreateBookDto): Promise<void>{
        const { title, author, category, year } = createBookDto;

        const book = this.create();
        book.title = title;
        book.author = author;
        book.category = category;
        book.year = year;
        book.user = user;

        try{
            await book.save();
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }
}