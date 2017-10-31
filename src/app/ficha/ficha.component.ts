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

	constructor(private router: Router,private activatedRouter: ActivatedRoute) { 
		
	}

	ngOnInit() {

	}

	home(){
		this.router.navigate(['/home']);
	}

}
