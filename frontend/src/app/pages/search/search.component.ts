import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  city = '';
  citySuggestions: any[] = [];
  selectedCoords: { lat: number; lon: number } | null = null;

  weather: any;
  hoy: any;
  forecast: any[] = [];
  diasPosteriores: any[] = [];
  horas: any[] = [];
  climaActual: string = ''; // ✅ Nuevo: para aplicar fondo dinámico

  constructor(private weatherService: WeatherService) {}

  // Obtener sugerencias al escribir
  onCityInputChange() {
    if (this.city.length < 2) {
      this.citySuggestions = [];
      return;
    }

    this.weatherService.getCitySuggestions(this.city).subscribe({
      next: (data) => this.citySuggestions = data,
      error: () => this.citySuggestions = []
    });
  }

  // Al seleccionar una ciudad
  selectSuggestion(suggestion: any) {
    const nombreBonito =
      suggestion.local_names?.es ||
      suggestion.name ||
      suggestion.state ||
      'CIUDAD DESCONOCIDA';

    this.city = `${nombreBonito}, ${suggestion.country}`;
    this.citySuggestions = [];
    this.selectedCoords = { lat: suggestion.lat, lon: suggestion.lon };

    // Clima actual
    this.weatherService.getWeatherByCoords(suggestion.lat, suggestion.lon).subscribe({
      next: (data) => {
        this.weather = {
          ...data,
          displayName: nombreBonito.toUpperCase()
        };
        this.climaActual = data.weather[0].main.toLowerCase(); // ✅ Guardamos tipo de clima
      }
    });

    // Pronóstico
    this.weatherService.getForecastByCoords(suggestion.lat, suggestion.lon).subscribe({
      next: (data) => {
        const agrupadoPorDia: { [key: string]: any[] } = {};

        data.list.forEach((item: any) => {
          const fecha = item.dt_txt.split(' ')[0];
          if (!agrupadoPorDia[fecha]) agrupadoPorDia[fecha] = [];
          agrupadoPorDia[fecha].push(item);
        });

        this.forecast = Object.keys(agrupadoPorDia).map((fecha) => {
          const datos = agrupadoPorDia[fecha];
          const mediodia = datos[Math.floor(datos.length / 2)];
          return {
            fecha,
            temp: mediodia.main.temp,
            icon: mediodia.weather[0].icon,
            desc: mediodia.weather[0].description
          };
        });

        this.hoy = this.forecast[0];
        this.diasPosteriores = this.forecast.slice(1);
        this.horas = data.list.slice(0, 8);
      },
      error: () => alert('No se pudo obtener el pronóstico.')
    });

    this.selectedCoords = null;
    this.city = ''; // ✅ Limpiar el input después de buscar
  }
}
