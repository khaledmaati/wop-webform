import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StylesService {
  constructor(  ) { }

  getClass(bausparkasse: string): string {
    switch (bausparkasse) {
      case 'Wüstenrot':
        return 'wüstenrot';
      case 'Schwäbisch Hall':
        return 'schwäbischHall';
      default:
        return 'default-class';
    }
  }

  getLogo(bausparkasse: string): string {
    switch (bausparkasse) {
      case 'Wüstenrot':
        return '../../assets/logo-wuestenrot.svg';
      case 'Schwäbisch Hall':
        return '../../assets/logo-schwaebisch-hall.svg';
      default:
        return '../../assets/logo-schwaebisch-hall.svg';
    }
  }
}
