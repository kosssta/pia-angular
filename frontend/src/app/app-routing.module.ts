import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { RasadnikComponent } from './rasadnik/rasadnik.component';
import { MagacinComponent } from './magacin/magacin.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { ProizvodDetaljiComponent } from './proizvod-detalji/proizvod-detalji.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { DodavanjeProizvodaComponent } from './dodavanje-proizvoda/dodavanje-proizvoda.component';
import { GrafikPoslovanjaComponent } from './grafik-poslovanja/grafik-poslovanja.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'poljoprivrednik', component: PoljoprivrednikComponent },
  { path: 'preduzece', component: PreduzeceComponent },
  { path: 'administrator', component: AdministratorComponent },
  { path: 'promenaLozinke', component: PromenaLozinkeComponent },
  { path: 'rasadnik/:idRas', component: RasadnikComponent },
  { path: 'magacin/:idRas', component: MagacinComponent },
  { path: 'prodavnica', component: ProdavnicaComponent },
  { path: 'prodavnica/:idPro', component: ProizvodDetaljiComponent },
  { path: 'proizvodi/:idPre', component: ProizvodiComponent },
  { path: 'dodavanje-proizvoda', component: DodavanjeProizvodaComponent },
  { path: 'grafik-poslovanja', component: GrafikPoslovanjaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
