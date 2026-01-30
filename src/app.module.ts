import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsModule } from './leads/leads.module';
import { TagsModule } from './tags/tags.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '123456',
      autoLoadEntities: true, // carrega entidades sem precisar especifica-las
      synchronize: true, // sincroniza a base de dados. Não deve ser usado em produção. Pode apagar dados. Perigoso!
    }),
    LeadsModule,
    TagsModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
