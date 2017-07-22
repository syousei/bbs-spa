import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from '../_services/index';
import { Topic } from '../_models/index';

@Injectable()
export class TopicService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getAll() {
        return this.http.get('http://localhost:8080/api/topics', this.jwt())
            .map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('http://localhost:8080/api/topics/' + id, this.jwt())
            .map((response: Response) => response.json());
    }

    create(topic: Topic) {
        return this.http.post('http://localhost:8080/api/topics', topic, this.jwt())
            .map((response: Response) => response.json());
    }
    /*
    update(topic: Topic) {
        return this.http.put('http://localhost:8080/api/topics' + topic.id, topic, this.jwt())
            .map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('http://localhost:8080/api/topics' + id, this.jwt())
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
