import { Injectable, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;
    name$ = new Subject<string>();

    constructor(private http: Http) {}

    signin(email: string, password: string): Observable<boolean> {
        return this.http.post('http://localhost:8080/api/authenticate', JSON.stringify({ email: email, password: password }), {withCredentials: true})
            .map((response: Response) => {
                let user = response.json();
                if (user && user.token) {
                    localStorage.setItem('signedInUser', JSON.stringify(user));
                    this.name$.next(user.name);
                    return true;
                } else {
                    return false;
                }
            });
    }

    signout(): void {
        this.token = null;
        this.name$.next(null);
        localStorage.removeItem('signedInUser');
    }
}