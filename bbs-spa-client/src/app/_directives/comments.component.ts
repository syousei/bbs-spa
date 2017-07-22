import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Topic, Comment } from '../_models/index';
import { CommentService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'comments',
    templateUrl: 'comments.component.html'
})

export class CommentsComponent implements OnInit {
    private comments: Comment[] = [];

    constructor(private route: ActivatedRoute,
        private commentService: CommentService,
    ) { }

    ngOnInit() {
        this.getComments();

    }

    getComments() {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.commentService.getByTopicId(+params.get('id')))
            .subscribe(comments => { this.comments = comments; });
    }

}