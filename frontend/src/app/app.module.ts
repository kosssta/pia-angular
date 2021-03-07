import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistracijaComponent } from './registracija/registracija.component';
import { LoginComponent } from './login/login.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { HeaderComponent } from './header/header.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { KorisnikDetaljiComponent } from './korisnik-detalji/korisnik-detalji.component';
import { DodavanjeKorisnikaComponent } from './dodavanje-korisnika/dodavanje-korisnika.component';
import { AzuriranjeKorisnikaComponent } from './azuriranje-korisnika/azuriranje-korisnika.component';
import { BrisanjeKorisnikaComponent } from './brisanje-korisnika/brisanje-korisnika.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RasadnikComponent } from './rasadnik/rasadnik.component';
import { SadnicaDetaljiComponent } from './sadnica-detalji/sadnica-detalji.component';
import { MagacinComponent } from './magacin/magacin.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { ProizvodDetaljiComponent } from './proizvod-detalji/proizvod-detalji.component';
import { FooterComponent } from './footer/footer.component';
import { KomentariComponent } from './komentari/komentari.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { DodavanjeProizvodaComponent } from './dodavanje-proizvoda/dodavanje-proizvoda.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GrafikPoslovanjaComponent } from './grafik-poslovanja/grafik-poslovanja.component';
import { ChartsModule } from 'ng2-charts';
import { OdrzavanjeComponent } from './odrzavanje/odrzavanje.component'

@NgModule({
  declarations: [
    AppComponent,
    RegistracijaComponent,
    LoginComponent,
    PoljoprivrednikComponent,
    PreduzeceComponent,
    AdministratorComponent,
    PromenaLozinkeComponent,
    HeaderComponent,
    KorisnikDetaljiComponent,
    DodavanjeKorisnikaComponent,
    AzuriranjeKorisnikaComponent,
    BrisanjeKorisnikaComponent,
    RasadnikComponent,
    SadnicaDetaljiComponent,
    MagacinComponent,
    ProdavnicaComponent,
    ProizvodDetaljiComponent,
    FooterComponent,
    KomentariComponent,
    ProizvodiComponent,
    DodavanjeProizvodaComponent,
    GrafikPoslovanjaComponent,
    OdrzavanjeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
