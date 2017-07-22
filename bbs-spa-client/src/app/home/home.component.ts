import { Component, OnInit } from '@angular/core';

import { Topic } from '../_models/index';
import { TopicService } from '../_services/index';


@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    topics: Topic[] = [];

    constructor(private topicService: TopicService) { }

    ngOnInit() {
        this.loadAllTopics();
    }

    loadAllTopics() {
        this.topicService.getAll()
            .subscribe(topics => { this.topics = topics; });
    }
}