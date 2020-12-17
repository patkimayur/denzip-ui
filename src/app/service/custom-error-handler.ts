import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    public handleError(error: any) {
        console.error(error);
        const routerService = this.injector.get(Router);
        const ngZone = this.injector.get(NgZone);
        ngZone.run(() => {
            routerService.navigate(['/error'], { skipLocationChange: true });
        });
    }

}
