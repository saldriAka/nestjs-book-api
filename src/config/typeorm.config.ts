import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'book_api',
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    synchronize: true
};