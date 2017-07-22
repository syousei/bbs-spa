import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NavbarComponent } from '../_directives/index';
import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'sign-in.component.html'
})

export class SignInComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
    ) { }

    ngOnInit() {
        this.authenticationService.signout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    signin() {
        this.loading = true;
        this.authenticationService.signin(this.model.email, this.model.password)
            .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            });
    }
}
