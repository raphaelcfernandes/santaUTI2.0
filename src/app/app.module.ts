import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AngularFireModule} from 'angularfire2';
import { LoginComponent } from './login/login.component';
import {AuthService} from './providers/auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';

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
	AppComponent,
	LoginComponent
	],
	imports: [
	BrowserModule,
	FormsModule,
	AngularFireModule.initializeApp(firebaseConfig),
	AngularFireAuthModule
	],
	providers: [AuthService],
	bootstrap: [AppComponent]
})
export class AppModule { }
