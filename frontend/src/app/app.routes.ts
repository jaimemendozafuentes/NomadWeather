import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'buscar', component: SearchComponent },
  { path: 'favoritos', component: FavoritesComponent },
];
