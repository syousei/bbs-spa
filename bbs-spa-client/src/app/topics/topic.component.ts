import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AuthenticationService } from '../_services/index';
import { Topic, Comment } from '../_models/index';
import { AlertService, TopicService, CommentService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'topic.component.html'
})

export class TopicComponent implements OnInit {
    private model: any = {};
    private loading = false;
    private signedIn: boolean = false;
    private topic_id: number;
    private topic: Topic;
    private comments: Comment[] = [];

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private topicService: TopicService,
        private commentService: CommentService,
    ) { }

    ngOnInit() {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.topicService.getById(+params.get('id')))
            .subscribe(topic => { this.topic = topic; });

        this.getComments();
        this.signedIn = this.checkSignedIn();
    }

    checkSignedIn() {
        if (localStorage.getItem('signedInUser')) {
            return true;
        }
    }

    getComments() {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.commentService.getByTopicId(+params.get('id')))
            .subscribe(comments => { this.comments = comments; });
        console.log('hoge');
    }

    submit() {
        this.loading = true;
        this.topic_id = this.route.snapshot.params['id']
        this.commentService.create(this.topic_id, this.model)
            .subscribe(
            data => {
                // サーバー側の処理を待つために仮に1秒
                setTimeout(() => {
                    this.alertService.success(data.alert, true);
                    this.getComments();
                    this.loading = false;
                    // コメントフォームを空にする
                    this.model.comment = ' ';
                }, 1000);
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            });
    }

}