import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Books } from 'src/models/books.entity';
import { Reviews } from 'src/models/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Books, Reviews]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
