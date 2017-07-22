import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'sign-up.component.html'
})

export class SignUpComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    signup() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success(data.message, true);
                this.router.navigate(['/users/signin']);
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            });
    }
}
