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
        return 'https://www.wuestenrot.de/media/assets/img/ci/WW_logo-wuestenrot-2019.svg';
      case 'Schwäbisch Hall':
        return 'https://www.schwaebisch-hall.de/content/experience-fragments/bshweb/site/header/master/_jcr_content/root/par/container/logo.coreimg.svg/1687934768061/logo-bausparkasse-schwaebisch-hall.svg';
      default:
        return 'N/A';
    }
  }
}
