import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, TopicService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'create-topic.component.html'
})

export class CreateTopicComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private topicService: TopicService,
        private alertService: AlertService) { }

    submit() {
        this.loading = true;
        this.topicService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success(data.alert, true);
                this.router.navigate(['/topics/' + data.id]);
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            });
    }

}