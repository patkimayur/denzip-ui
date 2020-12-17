import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.html',
  styleUrls: ['./error-component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // do init at here for current route.

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);  // 5s
  }

}
