import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '../../../constants';
import { EndpointService } from '../../../services/endpoint/endpoint.service';
import { StorageService } from '../../../services/storage/storage.service';
import { RegistrationModel } from '../../../models/registration.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registration: RegistrationModel = new RegistrationModel();

    constructor(private router: Router,
                private endpointService: EndpointService,
                private storageService: StorageService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(function() {
            window['lbd'].checkFullPageBackgroundImage();
            setTimeout(function() {
                window['$']('.card').removeClass('card-hidden');
            }, 1000);
        });
    }

    register() {
        this.endpointService.register(this.registration).subscribe(result => {
            if (result.success) {
                this.storageService.set(Constants.LOCAL_STORAGE.JWT, result.data.token);
                this.router.navigate(['dashboard']);
            }
        });
    }

}
