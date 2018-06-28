import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(function() {
            lbd.checkFullPageBackgroundImage();
            setTimeout(function() {
                // after 1000 ms we add the class animated to the login/register card
                $('.card').removeClass('card-hidden');
            }, 1000)
        });
    }

}
