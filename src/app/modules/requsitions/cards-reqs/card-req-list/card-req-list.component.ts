import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';

@Component({
    selector: 'app-card-req-list',
    templateUrl: './card-req-list.component.html',
    styleUrls: ['./card-req-list.component.scss'],
})
export class CardReqListComponent implements OnInit {
    cardRequisitions: any[];
    cardReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    cardReqTableColumns: string[] = [
        'title',
        'status',
        'duration',
        'name',
        'startDate',
        'amount',
        'action',
    ];
    isLoading: boolean = true;
    user: User;
    status = 'employee';

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _cardRequisitionService: CardRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getReqByRole();
        } else {
            this.setStatus('Created');
        }
        // this.getReqByRole();
    }

    getCardReqs() {
        this.isLoading = true;
        this._cardRequisitionService.getAllCardRequisitions().subscribe(
            (response) => {
                this.cardReqDataSource.data = response;
                console.log(this.cardReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch card requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }

    getFilteredCashReq() {
        this.isLoading = true;
        this._cardRequisitionService
            .getFilteredCardRequisitions(
                this.status == 'employee' ? false : true
            )
            .subscribe(
                (response) => {
                    this.cardReqDataSource.data = response;
                    console.log(this.cardReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch cash requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }

    getReqByRole() {
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getFilteredCashReq();
        } else if (this.user.roles[0].toUpperCase() == 'EMPLOYEE') {
            this.getCardReqs();
        } else if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getloggedCashReqs();
        }
    }
    getCashReqsByStatus() {
        this.isLoading = true;
        this._cardRequisitionService
            .getCardRequsitionByStatus(this.status)
            .subscribe(
                (response) => {
                    this.cardReqDataSource.data = response;
                    console.log(this.cardReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch cash requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }
    getloggedCashReqs() {
        this.isLoading = true;
        this._cardRequisitionService.getAllCardRequisitionsLogged().subscribe(
            (response) => {
                this.cardReqDataSource.data = response;
                console.log(this.cardReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch cash requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }
    setStatus(value) {
        this.status = value;
        if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getCashReqsByStatus();
        } else {
            this.getReqByRole();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createReq() {
        this._router.navigate(['axis/requsitions/card/create']);
    }

    viewReqVehilce(id: string) {
        this._router.navigateByUrl(`axis/requsitions/card/${id}`);
    }

    getHoursAndMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutes_ = minutes % 60;
        return `${hours}hours ${minutes_}min`;
    }

    getByMineEmployee(value) {
        this.status = value;

        this.getFilteredCashReq();
    }
}
