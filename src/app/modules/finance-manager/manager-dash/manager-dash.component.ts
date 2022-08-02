import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types'; import { VehicleService } from 'app/modules/admin/services/vehicles/vehicle.service';
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
  styleUrls: ['./manager-dash.component.css']
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
  status = "Created";
  currencySelected = "RTGS"
  cash = 1;
  card = 1;
  cards: any[] = [];
  cashMonthToMonth: any[] = [];
  cashDayToDay: any[] = [];
  cardMonthToMonth: any[] = [];
  cardDayToDay: any[] = [];

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
    // this._userService.user$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((user: User) => {
    //     console.log(user);

    //     this.user = user;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });


    // Attach SVG fill fixer to all ApexCharts
    window['Apex'] = {
      chart: {
        events: {
          mounted: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
          updated: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          }
        }
      }
    };

    this._vehicleService.getAllVehicleRequisitionsNotLogged().subscribe(vehicleReqs => {
      this.vehicleReq = vehicleReqs
      this._cashReqService.getAllCashRequisitionsLogged().subscribe(cashReqs => {
        this.cashReqs = cashReqs;
        this._cardReqservice.getAllCardRequisitionsLogged().subscribe(cardReqs => {
          this.cardReqs = cardReqs;
          this._assetReqService.getAllAssetRequisitionsLogged().subscribe(assetReqs => {
            this.assetsReqs = assetReqs;
            this._deviceReqService.getAllDeviceRequisitionsLogged().subscribe(deviceReqs => {
              this.deviceReqs = deviceReqs
              this.getCash()
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

  navigateTo(path: string) {
    this._router.navigate([path]);
  }
  setStatus(value,) {
    this.status = value;
    this.getCashMonthToMonthReporty()
    this.getCashDayToDayReporty()
  }
  setCash(value) {
    this.cash = value.id;
    this.currencySelected = value.currency;
    this.getCashMonthToMonthReporty()
    this.getCashDayToDayReporty();
  }
  setCard(value) {
    this.card = value.id;
    this.currencySelected = value.currency;
    this.getCashMonthToMonthReporty()
    this.getCashDayToDayReporty();
  }

  getCashMonthToMonthReporty() {
    this._cashReqService.getMonthToMonthReport({ id: this.cash, status: this.status }).subscribe(data => {
      console.log(data);
      this.cashMonthToMonth = data[0]
    }, error => {
      console.log(error);
    })
  }
  getCashDayToDayReporty() {
    this._cashReqService.getDayToDayReport({ id: this.cash, status: this.status }).subscribe(data => {
      console.log(data);
      this.cashDayToDay = data[0]
    }, error => {
      console.log(error);
    })
  }
  getCardMonthToMonthReporty() {
    this._cardReqservice.getMonthToMonthReport({ id: this.cash, status: this.status }).subscribe(data => {
      console.log(data);
      this.cardMonthToMonth = data[0]
    }, error => {
      console.log(error);
    })
  }
  getCardDayToDayReporty() {
    this._cardReqservice.getDayToDayReport({ id: this.card, status: this.status }).subscribe(data => {
      console.log(data);
      this.cardDayToDay = data[0]
    }, error => {
      console.log(error);
    })
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
    this._cashReqService.getCashs().subscribe(response => {
      this.cashs = response
      this._cardReqservice.getCards().subscribe(response => {
        this.cards = response
        this.loading = false;
      }, error => {
        this._alertService.displayError('Failed to load cards')
        this.loading = false;
      })
    }, error => {
      console.log(error);
      this.loading = false;

    })
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Fix the SVG fill references. This fix must be applied to all ApexCharts
   * charts in order to fix 'black color on gradient fills on certain browsers'
   * issue caused by the '<base>' tag.
   *
   * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
   *
   * @param element
   * @private
   */
  private _fixSvgFill(element: Element): void {
    // Current URL
    const currentURL = this._router.url;

    // 1. Find all elements with 'fill' attribute within the element
    // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
    // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
    Array.from(element.querySelectorAll('*[fill]'))
      .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
      .forEach((el) => {
        const attrVal = el.getAttribute('fill');
        el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
      });
  }

  /**
   * Prepare the chart data from the data
   *
   * @private
   */
  private _prepareChartData(): void {
    // Github issues
    this.chartGithubIssues = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: ['#64748B', '#94A3B8'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        background: {
          borderWidth: 0
        }
      },
      grid: {
        borderColor: 'var(--fuse-border)'
      },
      labels: this.data.githubIssues.labels,
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      series: this.data.githubIssues.series,
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.75
          }
        }
      },
      stroke: {
        width: [3, 0]
      },
      tooltip: {
        followCursor: true,
        theme: 'dark'
      },
      xaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          color: 'var(--fuse-border)'
        },
        labels: {
          style: {
            colors: 'var(--fuse-text-secondary)'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          offsetX: -16,
          style: {
            colors: 'var(--fuse-text-secondary)'
          }
        }
      }
    };

    // Task distribution
    this.chartTaskDistribution = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'polarArea',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      labels: this.data.taskDistribution.labels,
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        polarArea: {
          spokes: {
            connectorColors: 'var(--fuse-border)'
          },
          rings: {
            strokeColor: 'var(--fuse-border)'
          }
        }
      },
      series: this.data.taskDistribution.series,
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.75
          }
        }
      },
      stroke: {
        width: 2
      },
      theme: {
        monochrome: {
          enabled: true,
          color: '#93C5FD',
          shadeIntensity: 0.75,
          shadeTo: 'dark'
        }
      },
      tooltip: {
        followCursor: true,
        theme: 'dark'
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--fuse-text-secondary)'
          }
        }
      }
    };

    // Budget distribution
    this.chartBudgetDistribution = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'radar',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#818CF8'],
      dataLabels: {
        enabled: true,
        formatter: (val: number): string | number => `${val}%`,
        textAnchor: 'start',
        style: {
          fontSize: '13px',
          fontWeight: 500
        },
        background: {
          borderWidth: 0,
          padding: 4
        },
        offsetY: -15
      },
      markers: {
        strokeColors: '#818CF8',
        strokeWidth: 4
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: 'var(--fuse-border)',
            connectorColors: 'var(--fuse-border)'
          }
        }
      },
      series: this.data.budgetDistribution.series,
      stroke: {
        width: 2
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number): string => `${val}%`
        }
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            fontWeight: '500'
          }
        },
        categories: this.data.budgetDistribution.categories
      },
      yaxis: {
        max: (max: number): number => parseInt((max + 10).toFixed(0), 10),
        tickAmount: 7
      }
    };

    // Weekly expenses
    this.chartWeeklyExpenses = {
      chart: {
        animations: {
          enabled: false
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'line',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#22D3EE'],
      series: this.data.weeklyExpenses.series,
      stroke: {
        curve: 'smooth'
      },
      tooltip: {
        theme: 'dark'
      },
      xaxis: {
        type: 'category',
        categories: this.data.weeklyExpenses.labels
      },
      yaxis: {
        labels: {
          formatter: (val): string => `$${val}`
        }
      }
    };

    // Monthly expenses
    this.chartMonthlyExpenses = {
      chart: {
        animations: {
          enabled: false
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'line',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#4ADE80'],
      series: this.data.monthlyExpenses.series,
      stroke: {
        curve: 'smooth'
      },
      tooltip: {
        theme: 'dark'
      },
      xaxis: {
        type: 'category',
        categories: this.data.monthlyExpenses.labels
      },
      yaxis: {
        labels: {
          formatter: (val): string => `$${val}`
        }
      }
    };

    // Yearly expenses
    this.chartYearlyExpenses = {
      chart: {
        animations: {
          enabled: false
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'line',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#FB7185'],
      series: this.data.yearlyExpenses.series,
      stroke: {
        curve: 'smooth'
      },
      tooltip: {
        theme: 'dark'
      },
      xaxis: {
        type: 'category',
        categories: this.data.yearlyExpenses.labels
      },
      yaxis: {
        labels: {
          formatter: (val): string => `$${val}`
        }
      }
    };
  }

}
