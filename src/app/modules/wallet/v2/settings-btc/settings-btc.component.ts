import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { Client } from '../../../../services/api/client';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { WalletDashboardService } from '../dashboard.service';
@Component({
  selector: 'm-walletSettings--btc',
  templateUrl: './settings-btc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSettingsBTCComponent implements OnInit {
  showForm: boolean = false;
  loaded: boolean = false;
  inProgress: boolean = false;
  error: string;
  currentAddress: string = '';
  form;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.load();
  }
  async load() {
    // Check if already has an address
    const { address } = <any>await this.client.get('api/v2/wallet/btc/address');
    this.currentAddress = address;

    this.form = new FormGroup({
      addressInput: new FormControl('', {
        validators: [Validators.required, this.validateAddressFormat],
      }),
    });
    this.loaded = true;
    this.detectChanges();
  }

  validateAddressFormat(control: AbstractControl) {
    // This allows for some false positives bc bech32 format allows for longer length
    // but will catch some negatives so is better than nothing
    if (
      control.value.length &&
      !/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(control.value)
    ) {
      return { format: true }; // true if invalid
    }
    return null; // null if valid
  }

  async provideAddress() {
    if (this.form.invalid || this.inProgress) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      await this.client.post('api/v2/wallet/btc/address', {
        address: this.addressInput.value,
      });
      this.currentAddress = this.addressInput.value;
      this.showForm = false;
    } catch (e) {
      // TODOOJM get rid of form toast
      this.formToastService.error(e);
      console.error(e);
    } finally {
      this.inProgress = false;

      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
  get addressInput() {
    return this.form.get('addressInput');
  }
}