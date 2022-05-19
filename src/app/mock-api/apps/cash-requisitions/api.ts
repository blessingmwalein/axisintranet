import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api/mock-api.service';
import { categories as categoriesData, cashRequisitions as cashRequisitionsData, demoCashRequisitionSteps as demoCashRequisitionStepsData } from 'app/mock-api/apps/cash-requisitions/data';
import { FuseMockApiUtils } from '@fuse/lib/mock-api/mock-api.utils';

@Injectable({
    providedIn: 'root'
})
export class AcademyMockApi {
    private _categories: any[] = categoriesData;
    private _cashRequisitions: any[] = cashRequisitionsData;
    private _demoCashRequisitionsSteps: any[] = demoCashRequisitionStepsData;

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
            .onGet('api/apps/cash-requisitions/categories')
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
            .onGet('api/apps/cash-requisitions/cash-requisitions')
            .reply(() => {

                // Clone the courses
                const courses = cloneDeep(this._cashRequisitions);

                return [200, courses];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Course - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/cash-requisitions/cash-requisitions/cash-requisition')
            .reply(({ request }) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the courses and steps
                const courses = cloneDeep(this._cashRequisitions);
                const steps = cloneDeep(this._demoCashRequisitionsSteps);

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

        this._fuseMockApiService
            .onPost('api/apps/cash-requisitions/cash-requisitions')
            .reply(({ request }) => {

                // console.log(request);
                
                // Get the tag
                const newReq = cloneDeep(request.body.req);

                // Generate a new GUID
                newReq.id = FuseMockApiUtils.guid();

                // Unshift the new tag
                this._cashRequisitions.unshift(newReq);

                return [
                    200,
                    newReq
                ];
            });
    }
}
