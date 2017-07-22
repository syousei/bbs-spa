import { Component, ElementRef, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services/index';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    private userName: string;

    constructor(
        private authenticationService: AuthenticationService,
        private elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
        this.collapseMenu();
        this.authenticationService.name$
            .subscribe(name => { this.userName = name; });
    }

    ngDoCheck() { this.collapseMenu(); }

    collapseMenu() {
        var n = $('#navbar-collapse');
        n.off('click.menu');
        n.on('click.menu', function () { n.collapse('hide'); });
    }

}