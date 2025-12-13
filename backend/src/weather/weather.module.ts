// backend/src/weather/weather.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config'; // Zorg dat deze er is
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [
    // Importeer de ConfigModule zodat ConfigService werkt
    ConfigModule, 
    HttpModule
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}