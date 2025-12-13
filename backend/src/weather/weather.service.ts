// backend/src/weather/weather.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config'; // NIEUW
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly apiKey: string | undefined;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Haal de API Key op in de constructor
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    
    // Zorg dat de API Key aanwezig is
    if (!this.apiKey) {
      throw new InternalServerErrorException('OPENWEATHER_API_KEY is niet ingesteld.');
    }
  }

  // ... (de rest van de getCurrentWeather methode blijft hetzelfde)
  async getCurrentWeather(city: string) {
    try {
      // Gebruik de API Key
      const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=nl`;

      // ... (de rest van de logica)
      const { data } = await firstValueFrom(this.httpService.get(url));

      return {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
      };
    } catch (error) {
       // ...
    }
  }
}