import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'
import { CreateBookDto } from './dto/createbook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { FilterBookDto } from './dto/filterBook.dto';
import { BookRepository } from './repository/book.repository';
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from './entity/book.entity';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class BooksService {
  constructor(
    private bookRepository: BookRepository,
  ) {}

  async getBooks(user: User,filter: FilterBookDto): Promise<Book[]> {
    return await this.bookRepository.getBooks(user, filter);
  }

  async createBook(user: User, createBookDto: CreateBookDto): Promise<void>{
    return await this.bookRepository.createBook(user, createBookDto);
  }

  async getBookById(user: User, id: string): Promise<Book>{
    const book = await this.bookRepository.createQueryBuilder("book")
    .where("id = :id", { id })
    .andWhere("userId = :userId", { userId: user.id })
    .getOne();

    console.log(book);

    if(!book){
      throw new NotFoundException(`Book with id ${id} is not found`);
    }

    return book;
  }

  async updateBook(user: User, id: string, updateBookDto){
    const { title, author, category, year } = updateBookDto;

    const book = await this.getBookById(user, id);
    book.title = title;
    book.author = author;
    book.category = category;
    book.year = year;

    await book.save();
  }

  async deleteBook(user: User, id: string): Promise<void>{
    const result = await this.bookRepository.createQueryBuilder("book")
    .where("id = :id", { id })
    .andWhere("userId = :userId", { userId: user.id })
    .delete()
    .execute();
    
    if(result.affected == 0){
      throw new NotFoundException('Data not found');
    }
  }
}
