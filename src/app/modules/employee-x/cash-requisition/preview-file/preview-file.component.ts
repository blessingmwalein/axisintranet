import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'app-preview-file',
    templateUrl: './preview-file.component.html',
    styleUrls: ['./preview-file.component.scss'],
})
export class PreviewFileComponent implements OnInit {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<PreviewFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private sanitizer:DomSanitizer
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {}

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    getFileExtension(fileName: string): string {
        var fileExtension: string;
        fileExtension = fileName.replace(/^.*\./, '');
        return fileExtension;
    }
    isIMage(fileName: string): boolean {
        var fileExt = this.getFileExtension(fileName);
        var imagesExtension = ['png', 'jpg', 'jpeg'];
        if (imagesExtension.indexOf(fileExt) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    isPdf(fileName: string): boolean {
        var fileExt = this.getFileExtension(fileName);
        var imagesExtension = ['pdf'];
        if (imagesExtension.indexOf(fileExt) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    getImage(name: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(`http://154.120.241.142:8097/Files/${name}`);
    }
    getPdfUrl(name: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(`http://154.120.241.142:8097/Files/${name}`);
    }
}
