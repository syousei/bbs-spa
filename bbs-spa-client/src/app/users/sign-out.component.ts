import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'sign-out.component.html'
})

export class SignOutComponent {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
    ) { }

    ngOnInit() {
        this.authenticationService.signout();
        this.alertService.success('ログアウトしました。', true);
        this.router.navigate(['/users/signin']);
    }
}
