import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    img{
      width: 100%;
      border-radius: 5px;
    }
    `
  ]
})
export class AgregarComponent implements OnInit {

  creadores = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe: Heroe= {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.MarvelComics,
    alt_img: ''

  };

  constructor(private heroesService: HeroesService, 
              private activatedRoute: ActivatedRoute, 
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit(): void {

    if (!this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroePorId(id))
    )
    .subscribe(heroe => this.heroe = heroe);
  }

  guardar(){
    console.log('guardar');
    if (this.heroe.superhero.trim().length===0){
      return;
    }
    if (this.heroe.id) {
      //actualizar
      this.heroesService.actualizarHeroe(this.heroe)
      .subscribe( resp => {
        console.log('Actualizando: ', resp);
        this.mostrarSnackbar('Registro Actualizado');
      })
    } else {
      //nuevo registro
      this.heroesService.agregarHeroe(this.heroe)
      .subscribe( heroe => {
        console.log('Guardando: ', heroe);
        this.mostrarSnackbar('Registro Guardado');
        this.router.navigate(['/heroes/editar', heroe.id]);
      })
    }
  }

  borrar() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.heroesService.borrarHeroe(this.heroe.id!)
          .subscribe( resp => {
            console.log('Borrando: ', resp);
            this.mostrarSnackbar('Registro Borrado');
            this.router.navigate(['/heroes/']);
          });
        }
      }
    )
  }

  mostrarSnackbar(mensaje:string) {
    this.snackBar.open(mensaje, 'Ok!', {duration:3000});
  }
}
