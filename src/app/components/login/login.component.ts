import { Component, OnInit } from '@angular/core';

import { EndpointService } from '../../services/endpoint/endpoint.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  endpointService: EndpointService;

  username: string;
  password: string;

  constructor(endpointService: EndpointService) {
    this.endpointService = endpointService;
  }

  ngOnInit() {
  }

  login() {
    this.endpointService.login(this.username, this.password).subscribe(result => {
      console.log('login returned');
      console.log(result);
    });
  }

}
