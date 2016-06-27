import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { Modal } from '../modal';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'm-modal-translate',
  inputs: [ 'open' ],
  outputs: [ 'closed', 'action' ],
  directives: [ CORE_DIRECTIVES, Modal ],
  template: `
    <m-modal [open]="open" (closed)="close($event)">
      <ul>
        <li *ngFor="let language of languages">
          <a (click)="select(language.language)">{{ language.name }}</a>
        </li>
      </ul>
    </m-modal>
  `
})

export class TranslateModal {
  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  action: EventEmitter<any> = new EventEmitter();
  
  languages: any[] = [];

  constructor(public translation: TranslationService) { }

  ngOnInit() {
    this.translation.getLanguages()
      .then((languages: any[]) => {
        this.languages = languages;
      })
      .catch(e => {
        this.close();
        console.error('TranslateModal::onInit', e);
      })
  }

  select(language: string) {
    if (!language) {
      this.close();
      return;
    }

    this.action.emit({
      selected: language
    });
    this.close();
  }

  close(){
    this.open = false;
    this.closed.next(true);
  }
}
