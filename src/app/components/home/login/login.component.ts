import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { EndpointService } from '../../../services/endpoint/endpoint.service';
import { LoginModel } from '../../../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLogin: LoginModel = new LoginModel();

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
    this.endpointService.login(this.userLogin).subscribe(result => {
      if(result.success) {
        this.router.navigate(['dashboard']);
      }
    });
  }

}
