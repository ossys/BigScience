import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor() { }

  ngOnInit() {
  }

  login() {
      console.log('email: ' + this.email);
      console.log('password: ' + this.password);
  }

}
