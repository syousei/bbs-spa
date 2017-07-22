import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from '../_services/index';
import { Comment } from '../_models/index';

@Injectable()
export class CommentService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getByTopicId(id: number) {
        return this.http.get('http://localhost:8080/api/comments/' + id, this.jwt())
            .map((response: Response) => response.json());
    }

    create(id: number, comment: Comment) {
        return this.http.post('http://localhost:8080/api/comments/' + id, comment, this.jwt())
            .map((response: Response) => response.json());
    }
    /*
    update(comment: Comment) {
        return this.http.put('http://localhost:8080/api/comments' + comment.id, comment, this.jwt())
            .map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('http://localhost:8080/api/comments' + id, this.jwt())
            .map((response: Response) => response.json());
    }
    */
    private jwt() {
        let signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
        if (signedInUser && signedInUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + signedInUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

}
