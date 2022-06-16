import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { DeviceRequisitionService } from 'app/modules/employee-x/services/device-requisitions/device-requisitions.service';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  data: any;
  user: User;
  selectedProject: string = 'ACME Corp. Backend App';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  cashReqs: any[] = [];
  vehicleReq: any[] = [];
  deviceReqs: any[] = [];
  cardReqs: any[] = [];
  assetsReqs: any[] = [];
  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _vehicleService: VehicleRequisitionService,
    private _cashReqService: CashRequisitionService,
    private _cardReqservice: CardRequisitionService,
    private _assetReqService: AssetRequisitionService,
    private _deviceReqService: DeviceRequisitionService,
    private _alertService: AlertService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    //user data
    // Subscribe to user changes
    this.user = this._userService.getLocalUser();
    this._vehicleService.getAllVehicleRequisitions().subscribe(vehicleReqs => {
      this.vehicleReq = vehicleReqs
      this._cashReqService.getAllCashRequisitions().subscribe(cashReqs => {
        this.cashReqs = cashReqs;
        this._cardReqservice.getAllCardRequisitions().subscribe(cardReqs => {
          this.cardReqs = cardReqs;
          this._assetReqService.getAllAssetRequisitions().subscribe(assetReqs => {
            this.assetsReqs = assetReqs;
            this._deviceReqService.getAllDeviceRequisitions().subscribe(deviceReqs => {
              this.deviceReqs = deviceReqs
            }, error => {
              this._alertService.displayError('Failed to load device requisitions')
            })
          }, error => {
            this._alertService.displayError('Failed to load asset requisitions')
          })
        }, error => {
          this._alertService.displayError('Failed to load card requisitions')
        })
      }, error => {
        this._alertService.displayError('Failed to load cash requisitions')
      })
    }, error => {
      this._alertService.displayError('Failed to load vehicle requisitions');
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }



}
