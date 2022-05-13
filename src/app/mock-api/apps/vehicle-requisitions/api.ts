import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api/mock-api.service';
import { categories as categoriesData, vehicleRequisitions as vehicleRequisitionsData, demoVehicleRequisitionSteps as demoVehicleRequisitionStepsData } from 'app/mock-api/apps/vehicle-requisitions/data';

@Injectable({
    providedIn: 'root'
})
export class AcademyMockApi {
    private _categories: any[] = categoriesData;
    private _vehicleRequisitions: any[] = vehicleRequisitionsData;
    private _demoVehicleRequisitionsSteps: any[] = demoVehicleRequisitionStepsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Categories - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/vehicle-requisitions/categories')
            .reply(() => {

                // Clone the categories
                const categories = cloneDeep(this._categories);

                // Sort the categories alphabetically by title
                categories.sort((a, b) => a.title.localeCompare(b.title));

                return [200, categories];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Courses - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/vehicle-requisitions/vehicle-requisitions')
            .reply(() => {

                // Clone the courses
                const courses = cloneDeep(this._vehicleRequisitions);

                return [200, courses];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Course - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/vehicle-requisitions/vehicle-requisitions/vehicle-requisition')
            .reply(({ request }) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the courses and steps
                const courses = cloneDeep(this._vehicleRequisitions);
                const steps = cloneDeep(this._demoVehicleRequisitionsSteps);

                // Find the course and attach steps to it
                const course = courses.find(item => item.id === id);
                if (course) {
                    course.steps = steps;
                }

                return [
                    200,
                    course
                ];
            });
    }
}
