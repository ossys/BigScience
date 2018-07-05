import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { EndpointService } from '../../../services/endpoint/endpoint.service';
import { RegistrationModel } from '../../../models/registration.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registration: RegistrationModel = new RegistrationModel();

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
        this.endpointService.register(this.registration).subscribe(result => {
            this.router.navigate(['dashboard']);
        });
    }

}
