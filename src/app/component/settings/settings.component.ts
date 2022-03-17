import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
  tap,
} from 'rxjs/operators';
import { Team } from 'src/app/model/Team';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('80ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class SettingsComponent implements OnInit {
  savedStartTeam$: Observable<Team | undefined> = new Observable<
    Team | undefined
  >();

  teamsList: Team[] = [];
  searchList: Team[] = [];
  searchString: string = '';

  searchListState: 'not-started' | 'searching' | 'no-results' | 'has-results' =
    'not-started';

  @ViewChild('input') input: ElementRef | undefined;
  inputSubscription: Subscription | undefined;

  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    @Inject(WINDOW) readonly winRef: Window,
    private settingsService: SettingsService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.savedStartTeam$ = this.settingsService.savedStartTeam$;

    this.http
      .get<Team[]>('/assets/allTeams.json')
      .pipe(take(1))
      .subscribe((teams) => (this.teamsList = teams));
  }

  ngAfterViewInit() {
    this.inputSubscription = fromEvent<ElementRef>(
      this.input!.nativeElement,
      'keyup'
    )
      .pipe(
        filter(Boolean),
        debounceTime(250),
        distinctUntilChanged(),
        tap(async (ev) => {
          this.searchListState = 'searching';
          this.searchString = this.input?.nativeElement.value;
          if (this.searchString.length > 2) {
            this.searchList = this._searchTeams(this.searchString);

            if (this.searchList.length === 0) {
              this.searchListState = 'no-results';
            } else {
              this.searchListState = 'has-results';
            }
          } else {
            this.searchListState = 'not-started';
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.inputSubscription?.unsubscribe();
  }

  private _searchTeams(searchString: string): Team[] {
    const foundTeams = this.teamsList.filter((team) =>
      team.teamName.toLowerCase().includes(searchString.toLowerCase())
    );

    return foundTeams.sort((a, b) => {
      if (a.teamName < b.teamName) {
        return -1;
      }
      if (a.teamName > b.teamName) {
        return 1;
      }
      return 0;
    });
  }

  setTeam(team: Team) {
    this.settingsService.setStartTeam(team);
    this.router.navigateByUrl('/');
  }

  generateHighlightedName(team: Team, searchString: string): string {
    const name = team.teamName;
    const startIndex = name.toLowerCase().indexOf(searchString.toLowerCase());
    const endIndex = startIndex + searchString.length;

    return `${name.substring(
      0,
      startIndex
    )}<span class='font-bold text-fuchsia-500'>${name.substring(
      startIndex,
      endIndex
    )}</span>${name.substring(endIndex)}`;
  }

  clearTeam() {
    this.settingsService.setStartTeam(undefined);
  }
}
