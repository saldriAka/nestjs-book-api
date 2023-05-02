import { Body, Query, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/createbook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { FilterBookDto } from './dto/filterBook.dto';
import { Book } from './entity/book.entity'; 
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entity/users.entity';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('books')
@UseGuards(JwtGuard)
export class BooksController {

    constructor(private booksService: BooksService){}
    
    @Get('/search')
    async getBooks(
        @Query() filter: FilterBookDto, 
        @GetUser() user: User
    ): Promise<Book[]> {
        return this.booksService.getBooks(user, filter);
    }

    @Post()
    //@UsePipes(ValidationPipe)
    async createBook(
        @GetUser() user: User,
        @Body() payload: CreateBookDto, 
    ): Promise<void>{
        return this.booksService.createBook(user, payload);
    }

    @Get('/:id')
    async getBook(@GetUser() user: User, @Param('id', UUIDValidationPipe) id: string): Promise<Book>{
        return this.booksService.getBookById(user, id);
    }

    @Put('/:id')
    //@UsePipes(ValidationPipe)
    async updateBook(
        @GetUser() user: User,
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: UpdateBookDto
    ): Promise<void>{
        return this.booksService.updateBook(user, id, payload);
    }

    @Delete('/:id')
    async deleteBook(@GetUser() user: User, @Param('id') id: string): Promise<void>{
        return this.booksService.deleteBook(user, id);
    }
}
