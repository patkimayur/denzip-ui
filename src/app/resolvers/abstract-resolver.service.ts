import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

export abstract class AbstractResolver<T> implements Resolve<T | string> {

    constructor() { }

    abstract resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T | string>;

    handleError(err: string, router: Router) {
        console.error('Handling error: "%s" for current url4: %s', err, router.url);
        router.navigate(['/error']);
        return of(err);
    }
}
