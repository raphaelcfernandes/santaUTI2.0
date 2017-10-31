import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginComponent } from './login/login.component';
import { AuthService } from './providers/auth.service';
import { DatabaseService } from './providers/database.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './providers/auth-guard.service';
import { FichaComponent } from './ficha/ficha.component';

export const firebaseConfig = {
	apiKey: "AIzaSyBcE_YeumSzNFKWlvZxTHq3a7QRW1MvL9c",
	authDomain: "santauti-4c4da.firebaseapp.com",
	databaseURL: "https://santauti-4c4da.firebaseio.com",
	projectId: "santauti-4c4da",
	storageBucket: "santauti-4c4da.appspot.com",
	messagingSenderId: "666817934398"
};

@NgModule({
	declarations: [
	LoginComponent,
	HomeComponent,
	AppComponent,
	FichaComponent
	],
	imports: [
	AppRoutingModule,
	BrowserModule,
	FormsModule,
	AngularFireModule.initializeApp(firebaseConfig),
	AngularFireAuthModule,
	AngularFireDatabaseModule
	],
	providers: [AuthService,DatabaseService,AuthGuardService],
	bootstrap: [AppComponent]
})
export class AppModule { }
