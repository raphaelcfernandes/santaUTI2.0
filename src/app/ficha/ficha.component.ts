import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RouterOutlet } from '@angular/router';	
import { ActivatedRoute } from '@angular/router';
import { Observable} from 'rxjs/Observable';
@Component({
	selector: 'app-ficha',
	templateUrl: './ficha.component.html',
	styleUrls: ['./ficha.component.css']
})
export class FichaComponent implements OnInit {
	Title: any;
	Link: any;
	tiles = [
	{text: 'One', cols: 1, rows: 1, color: 'lightblue'},
	{text: 'Two', cols: 1, rows:1, color: 'lightgreen'},
	{text: 'Three', cols: 2, rows: 1, color: 'lightpink'},

	];
	constructor(private router: Router,private activatedRouter: ActivatedRoute) { 
		
	}

	ngOnInit() {

	}

	home(){
		this.router.navigate(['/home']);
	}

}
