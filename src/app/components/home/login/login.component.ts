import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { EndpointService } from '../../../services/endpoint/endpoint.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(private router: Router, private endpointService: EndpointService) { }

  ngOnInit() {
  }
    
  ngAfterViewInit() {
    setTimeout(function() {
        window['lbd'].checkFullPageBackgroundImage();
        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            window['$']('.card').removeClass('card-hidden');
        }, 500);
    });
  }

  login() {
    this.endpointService.login(this.email, this.password).subscribe(result => {
      if(result.success) {
        this.router.navigate(['dashboard']);
      }
    });
  }

}
