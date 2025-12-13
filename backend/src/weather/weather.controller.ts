// backend/src/weather/weather.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather') // 1. Bepaalt de basisroute: /weather
export class WeatherController {
  
  // Dependency Injection: De Service wordt automatisch beschikbaar gemaakt
  constructor(private readonly weatherService: WeatherService) {}

  @Get() // 2. Bepaalt de methode en de subroute: GET /weather
  async getWeather(@Query('city') city: string) {
    
    // 3. Valideert en stelt een standaardwaarde in
    // Als de gebruiker geen ?city= meegeeft, gebruiken we "Sint-Niklaas"
    if (!city) {
        city = 'Sint-Niklaas'; 
    }
    
    // 4. Delegeert de taak (het ophalen van weerdata) aan de Service
    const weatherData = await this.weatherService.getCurrentWeather(city);
    
    // 5. Stuurt het getransformeerde resultaat terug naar de client (Vue)
    return weatherData;
  }
}