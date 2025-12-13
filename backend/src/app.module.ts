// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module'; // Zorg dat het pad klopt

@Module({
  imports: [
    // 1. ConfigModule is de eerste import en is globaal
    ConfigModule.forRoot({
      // isGlobal: true maakt ConfigService beschikbaar in alle andere modules
      isGlobal: true, 
    }),
    
    // 2. Importeer je feature module
    WeatherModule,
  ],
  // Controllers en Providers leeg laten als je ze niet gebruikt
  controllers: [],
  providers: [],
})
export class AppModule {}