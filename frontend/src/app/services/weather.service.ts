import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = environment.weatherApiUrl;
  private apiKey = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`);
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(`${environment.weatherForecastUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`);
  }

  getCitySuggestions(city: string): Observable<any> {
    const limit = 10;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`);
  }

  getForecastByCoords(lat: number, lon: number): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`);
  }


}

