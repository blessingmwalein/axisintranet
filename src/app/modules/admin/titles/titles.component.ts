import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Title } from '../models/titles/title.types';
import { TitleService } from '../services/titles/title.service';
import { CreateTitleComponent } from './create-title/create-title.component';

@Component({
    selector: 'app-titles',
    templateUrl: './titles.component.html',
    styleUrls: ['./titles.component.scss'],
})
export class TitlesComponent implements OnInit {
    @ViewChild('titlesTable', { read: MatSort }) titlesTableSort: MatSort;

    titlesDataSource: MatTableDataSource<any> = new MatTableDataSource();
    titlesTableColumns: string[] = ['description', 'name', 'status', 'action'];

    isLoading: boolean = true;
    titles: Title[];

    constructor(
        private _userService: UserService,
        private _titleService: TitleService,
        private _alertService: AlertService,
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit() {
        this.getTitles();
    }

    getTitles() {
        this._titleService.getTitles().subscribe(
            (titles: any) => {
                this.titlesDataSource.data = titles;
                this.isLoading = false;
            },
            (error) => {
                this.isLoading = false;
                console.log(error);
            }
        );
    }

    ngAfterViewInit(): void {
        // Make the data source sortable
        this.titlesDataSource.sort = this.titlesTableSort;
    }

    openCreateTitleDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(CreateTitleComponent, {
            data: { isEdit: false },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            this.getTitles();
        });
    }

    openEditTitleDialog(id: string): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(CreateTitleComponent, {
            data: { isEdit: true, id: id },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            this.getTitles();
        });
    }

    openDeleteDialog(id: string) {
        const dialogRef = this._fuseConfirmationService.open({
            message: 'Are sure you want to delete this title ?',
            title: 'Delete title confirmation',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                this.deteleTitle(id);
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Title delete canceled');
            }
        });
    }

    deteleTitle(id: string) {
        this.isLoading = true;
        this._titleService.deleteTitle(id).subscribe(
            (response) => {
                this._alertService.displayMessage('Title Deleted');
                this.getTitles();
                this.isLoading = false;
            },
            (error) => {
                this.isLoading = false;
                this._alertService.displayError(
                    `Something went wrong:  ${error?.error?.message}`
                );
            }
        );
    }
}
