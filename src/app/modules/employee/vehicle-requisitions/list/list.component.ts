import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, VehicleRequisition } from '../../models/vehicle-requisitions/vehicle-requisitions.types';
import { VehicleRequisitionService } from '../../services/vehicle-requisitions/vehicle-requisitions.service';
import moment from 'moment';

@Component({
    selector: 'vehecle-requisition-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleRequisitionListComponent implements OnInit, OnDestroy {
    categories: Category[];
    vehicleRequisitions: VehicleRequisition[];
    filteredVehicleRequisitions: VehicleRequisition[];
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
        private _vehicleRequisitionService: VehicleRequisitionService
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
        this._vehicleRequisitionService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the vehicleRequisitions
        this._vehicleRequisitionService.vehicleRequisitions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vehicleRequisitions: VehicleRequisition[]) => {
                this.vehicleRequisitions = this.filteredVehicleRequisitions = vehicleRequisitions;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Filter the vehicleRequisitions
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) => {

                // Reset the filtered vehicleRequisitions
                this.filteredVehicleRequisitions = this.vehicleRequisitions;

                // Filter by category
                if (categorySlug !== 'all') {
                    this.filteredVehicleRequisitions = this.filteredVehicleRequisitions.filter(vehicleRequisition => vehicleRequisition.category === categorySlug);
                }

                // Filter by search query
                if (query !== '') {
                    this.filteredVehicleRequisitions = this.filteredVehicleRequisitions.filter(vehicleRequisition => vehicleRequisition.title.toLowerCase().includes(query.toLowerCase())
                        || vehicleRequisition.description.toLowerCase().includes(query.toLowerCase())
                        || vehicleRequisition.category.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if (hideCompleted) {
                    this.filteredVehicleRequisitions = this.filteredVehicleRequisitions.filter(vehicleRequisition => vehicleRequisition.progress.completed === 0);
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
     * Show/hide completed vehicleRequisitions
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
}
