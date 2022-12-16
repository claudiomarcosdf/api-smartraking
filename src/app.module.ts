import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/smartraking', {
      useNewUrlParser: true
    }),
    JogadoresModule,
    CategoriasModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
