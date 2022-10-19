import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroes.interface';

@Pipe({
  name: 'imagen',
  pure: false //se dispara siempre siempre no es recomendado si no es necesario, por tema de recursos
})
export class ImagenPipe implements PipeTransform {

  transform(heroe: Heroe): string {

    if(!heroe.id && !heroe.alt_img){
      return `http://localhost:4200/assets/no-image.png`;
    } else if ( heroe.alt_img ){
      return heroe.alt_img;
    }
    return `http://localhost:4200/assets/heroes/${heroe.id}.jpg`;
  }

}
