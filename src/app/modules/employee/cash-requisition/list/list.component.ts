import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, CashRequisition } from '../../models/cash-requisitions/cash-requisitions.types';
import { CashRequisitionService } from '../../services/cash-requisitions/cash-requisitions.service';
import moment from 'moment';

@Component({
    selector: 'cash-requisition-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashRequisitionListComponent implements OnInit, OnDestroy {
    categories: Category[];
    cashRequisitions: CashRequisition[];
    filteredCashRequisitions: CashRequisition[];
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
            categorySlug$: new BehaviorSubject('all'),
            query$: new BehaviorSubject(''),
            hideCompleted$: new BehaviorSubject(false)
        };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _cashRequisitionService: CashRequisitionService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the categories
        this._cashRequisitionService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the cashRequisitions
        this._cashRequisitionService.cashRequisitions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((cashRequisitions: CashRequisition[]) => {
                this.cashRequisitions = this.filteredCashRequisitions = cashRequisitions;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Filter the cashRequisitions
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) => {

                // Reset the filtered cashRequisitions
                this.filteredCashRequisitions = this.cashRequisitions;

                // Filter by category
                if (categorySlug !== 'all') {
                    this.filteredCashRequisitions = this.filteredCashRequisitions.filter(CashRequisition => CashRequisition.category === categorySlug);
                }

                // Filter by search query
                if (query !== '') {
                    this.filteredCashRequisitions = this.filteredCashRequisitions.filter(CashRequisition => CashRequisition.title.toLowerCase().includes(query.toLowerCase())
                        || CashRequisition.description.toLowerCase().includes(query.toLowerCase())
                        || CashRequisition.category.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if (hideCompleted) {
                    this.filteredCashRequisitions = this.filteredCashRequisitions.filter(CashRequisition => CashRequisition.progress.completed === 0);
                }
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
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: MatSelectChange): void {
        this.filters.categorySlug$.next(change.value);
    }

    /**
     * Show/hide completed cashRequisitions
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */

    isOverdue(endDate: string): boolean {
        return moment(endDate, moment.ISO_8601).isBefore(moment(), 'days');
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createReq(){
        this._router.navigate(['axis/employee/requisitions/cash/create']);
    }
}
