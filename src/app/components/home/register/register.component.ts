import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { EndpointService } from '../../../services/endpoint/endpoint.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;

    constructor(private router: Router, private endpointService: EndpointService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(function() {
            window['lbd'].checkFullPageBackgroundImage();
            setTimeout(function() {
                window['$']('.card').removeClass('card-hidden');
            }, 1000)
        });
    }

    register() {
        this.endpointService.register(this.email, this.username, this.first_name, this.last_name, this.password).subscribe(result => {
            this.router.navigate(['dashboard']);
        });
    }

}
