import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EndpointService } from '../../services/endpoint/endpoint.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private router: Router, private endpointService: EndpointService) { }

  ngOnInit() {
  }

  login() {
    this.endpointService.login(this.username, this.password).subscribe(result => {
      if(result.success) {
        this.router.navigate(['dashboard']);
      }
    });
  }

}
