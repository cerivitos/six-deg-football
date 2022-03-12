import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { from, fromEvent, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { Player } from 'src/app/model/Player';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  customStartPlayer: Player | undefined;
  difficulty: number = 1;

  searchList: Player[] = [];

  @ViewChild('input') input: ElementRef | undefined;
  inputSubscription: Subscription | undefined;

  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const savedPlayer = this.localStorage.getItem('customStartPlayer');
    if (savedPlayer) {
      this.customStartPlayer = JSON.parse(savedPlayer) as Player;
    }

    const savedDifficulty = this.localStorage.getItem('difficulty');
    if (savedDifficulty) {
      this.difficulty = parseInt(savedDifficulty);
    }
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
          const searchString = this.input?.nativeElement.value;
          if (searchString && searchString.length > 3) {
            console.table(this.searchList);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.inputSubscription?.unsubscribe();
  }
}
