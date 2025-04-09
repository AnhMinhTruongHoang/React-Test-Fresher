import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VnpayModule } from './vnpay/vnpay.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VnpayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
