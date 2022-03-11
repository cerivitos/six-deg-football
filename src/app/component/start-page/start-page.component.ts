import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css'],
})
export class StartPageComponent implements OnInit {
  version: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<string>('/api/query-sha')
      .pipe(take(1))
      .subscribe((sha) => (this.version = sha));
  }
}
