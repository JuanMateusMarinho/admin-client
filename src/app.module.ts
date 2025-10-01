import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
  ],
  controllers: [UserController],
  providers: [AppService],
})
export class AppModule {}
