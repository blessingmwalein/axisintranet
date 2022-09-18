import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { VehicleService } from 'app/modules/admin/services/vehicles/vehicle.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { DeviceRequisitionService } from 'app/modules/employee-x/services/device-requisitions/device-requisitions.service';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { ApexOptions } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-manager-dash',
    templateUrl: './manager-dash.component.html',
    styleUrls: ['./manager-dash.component.css'],
})
export class ManagerDashComponent implements OnInit {
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    user: any;
    selectedProject: string = 'Dashboard';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading = true;
    cashReqs: any[] = [];
    vehicleReq: any[] = [];
    deviceReqs: any[] = [];
    cardReqs: any[] = [];
    assetsReqs: any[] = [];
    cashs: any[] = [];
    status = 'Created';
    currencySelected = 'RTGS';
    cash = 1;
    card = 1;
    cards: any[] = [];
    cashMonthToMonth: any[] = [];
    cashMonthToMonthDetail: any[] = [];
    cashDayToDay: any[] = [];
    cashDayToDayDetail: any[] = [];
    cardMonthToMonth: any[] = [];
    cardMonthToMonthDetail: any[] = [];
    cardDayToDay: any[] = [];
    cardDayToDayDetail: any[] = [];
    todayDate = Date.now();
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _alertService: AlertService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _vehicleService: VehicleRequisitionService,
        private _cashReqService: CashRequisitionService,
        private _cardReqservice: CardRequisitionService,
        private _assetReqService: AssetRequisitionService,
        private _deviceReqService: DeviceRequisitionService
    ) {}

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

        this._vehicleService.getAllVehicleRequisitionsNotLogged().subscribe(
            (vehicleReqs) => {
                this.vehicleReq = vehicleReqs;
                this._cashReqService.getAllCashRequisitionsLogged().subscribe(
                    (cashReqs) => {
                        this.cashReqs = cashReqs;
                        this._cardReqservice
                            .getAllCardRequisitionsLogged()
                            .subscribe(
                                (cardReqs) => {
                                    this.cardReqs = cardReqs;
                                    this._assetReqService
                                        .getAllAssetRequisitionsLogged()
                                        .subscribe(
                                            (assetReqs) => {
                                                this.assetsReqs = assetReqs;
                                                this._deviceReqService
                                                    .getAllDeviceRequisitionsLogged()
                                                    .subscribe(
                                                        (deviceReqs) => {
                                                            this.deviceReqs =
                                                                deviceReqs;
                                                            this.getCash();
                                                        },
                                                        (error) => {
                                                            this._alertService.displayError(
                                                                'Failed to load device requisitions'
                                                            );
                                                        }
                                                    );
                                            },
                                            (error) => {
                                                this._alertService.displayError(
                                                    'Failed to load asset requisitions'
                                                );
                                            }
                                        );
                                },
                                (error) => {
                                    this._alertService.displayError(
                                        'Failed to load card requisitions'
                                    );
                                }
                            );
                    },
                    (error) => {
                        this._alertService.displayError(
                            'Failed to load cash requisitions'
                        );
                    }
                );
            },
            (error) => {
                this._alertService.displayError(
                    'Failed to load vehicle requisitions'
                );
            }
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    navigateTo(path: string) {
        this._router.navigate([path]);
    }
    setStatus(value) {
        this.status = value;
        this.getCashMonthToMonthReporty();
        this.getCashMonthToMonthReportyDetail();
        this.getCashDayToDayReporty();
        this.getCashDayToDayReportyDetail();
    }
    setCash(value) {
        this.cash = value.id;
        this.currencySelected = value.currency;
        this.getCashMonthToMonthReporty();
        this.getCashMonthToMonthReportyDetail();
        this.getCashDayToDayReporty();
        this.getCashDayToDayReportyDetail();
    }
    setCard(value) {
        this.card = value.id;
        this.currencySelected = value.currency;
        this.getCashMonthToMonthReporty();
        this.getCashMonthToMonthReportyDetail();
        this.getCashDayToDayReporty();
        this.getCashDayToDayReportyDetail();
    }

    getCashMonthToMonthReporty() {
        this._cashReqService
            .getMonthToMonthReport({ id: this.cash, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cashMonthToMonth = data[0];
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    getCashMonthToMonthReportyDetail() {
        this._cashReqService
            .getMonthToMonthDetail({ id: this.cash, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cashMonthToMonthDetail = data;
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    getCashDayToDayReporty() {
        this._cashReqService
            .getDayToDayReport({ id: this.cash, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cashDayToDayDetail = data;
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    getCashDayToDayReportyDetail() {
        this._cashReqService
            .getDayToDayReportDetail({ id: this.cash, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cashDayToDay = data;
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    //card
    getCardMonthToMonthReporty() {
        this._cardReqservice
            .getMonthToMonthReport({ id: this.cash, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cardMonthToMonth = data[0];
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    getCardDayToDayReporty() {
        this._cardReqservice
            .getDayToDayReport({ id: this.card, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cardDayToDay = data[0];
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    getCardMonthToMonthReportyDetail() {
        this._cardReqservice
            .getMonthToMonthDetail({ id: this.cash, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cardMonthToMonth = data[0];
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    getCardDayToDayReportyDetail() {
        this._cardReqservice
            .getDayToDayReportDetail({ id: this.card, status: this.status })
            .subscribe(
                (data) => {
                    console.log(data);
                    this.cardDayToDay = data[0];
                },
                (error) => {
                    console.log(error);
                }
            );
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

    getCash() {
        this._cashReqService.getCashs().subscribe(
            (response) => {
                this.cashs = response;
                this._cardReqservice.getCards().subscribe(
                    (response) => {
                        this.cards = response;
                        this.loading = false;
                    },
                    (error) => {
                        this._alertService.displayError('Failed to load cards');
                        this.loading = false;
                    }
                );
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }
}
