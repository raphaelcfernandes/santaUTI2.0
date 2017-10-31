import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RouterOutlet } from '@angular/router';	
@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css']
})
export class FichaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  home(){
  	this.router.navigate(['/home']);
  }

}
