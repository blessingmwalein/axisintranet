import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { GraficoModel } from 'app/models/graghp';
import { User } from 'app/modules/admin/models/users/users.types';
import { VehicleService } from 'app/modules/admin/services/vehicles/vehicle.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { DeviceRequisitionService } from 'app/modules/employee-x/services/device-requisitions/device-requisitions.service';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { ApexOptions, ChartType } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartConfiguration, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TitleService } from 'app/modules/admin/services/titles/title.service';

@Component({
    selector: 'app-manager-dash',
    templateUrl: './manager-dash.component.html',
    styleUrls: ['./manager-dash.component.css'],
})
export class ManagerDashComponent implements OnInit {
    private newLabel?= 'New label';
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

    title = 'ng2-charts-demo';

    public barChartLegend = true;
    public barChartPlugins = [];
    titles: any[] = [];

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: ['Finance & Admin', 'Procument', 'HR', 'Operations'],
        datasets: [
            { data: [4000, 15000, 10000, 5000], label: 'RTGS' },
            { data: [1000, 1500, 5000, 50000], label: 'USD' },
        ]
    };

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: false,
    };
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
        private _deviceReqService: DeviceRequisitionService,
        private _titleService: TitleService
    ) {

        this._titleService.getTitles().subscribe((data) => {
            this.titles = data;
        });
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
    // MontarGrafico() {
    //     this.List.forEach(element => {
    //         this.Total += element.Value;
    //     });

    //     this.List.forEach(element => {
    //         element.Size = Math.round((element.Value * this.MaxHeight) / this.Total) + '%';
    //     });
    // }
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

    public lineChartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [34000, 8000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                label: 'RTGS',
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                fill: 'origin',
            },
            {
                data: [1200, 5000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                label: 'USD',
                backgroundColor: 'rgba(77,83,96,0.2)',
                borderColor: 'rgba(77,83,96,1)',
                pointBackgroundColor: 'rgba(77,83,96,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)',
                fill: 'origin',
            }
        ],
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    public lineChartOptions: ChartConfiguration['options'] = {
        elements: {
            line: {
                tension: 0.5
            }
        },
        scales: {
            // We use this empty structure as a placeholder for dynamic theming.
            y:
            {
                position: 'left',
            },
            y1: {
                position: 'right',
                grid: {
                    color: 'rgba(255,0,0,0.3)',
                },
                ticks: {
                    color: 'red'
                }
            }
        },


    };

    public lineChartType: ChartType = 'line';

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    private static generateNumber(i: number): number {
        return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
    }



    // events
    public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }

    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }



    public changeColor(): void {
        this.lineChartData.datasets[2].borderColor = 'green';
        this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

        this.chart?.update();
    }

    public changeLabel(): void {
        const tmp = this.newLabel;
        this.newLabel = this.lineChartData.datasets[2].label;
        this.lineChartData.datasets[2].label = tmp;

        this.chart?.update();
    }

    //create function to filter table data by title
    filterTableDataByTitle(event: any) {
        var searchText = event.value;
        console.log('text'+searchText);
        this.cashMonthToMonthDetail = this.cashMonthToMonthDetail.filter((item) => {
            return item.title.toLowerCase().match(searchText.toLowerCase());
        });
    }

    
}
