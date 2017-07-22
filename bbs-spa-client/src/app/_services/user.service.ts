import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from '../_services/index';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getUsers(): Observable<User[]> {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get('http://localhost:8080/api/users', options)
            .map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post('http://localhost:8080/api/users', user, this.jwt())
            .map((response: Response) => response.json());
    }

    /*
    update(user: User) {
        return this.http.put('http://localhost:8080/api/users' + user.id, user, this.jwt())
            .map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('http://localhost:8080/api/users' + id, this.jwt())
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
