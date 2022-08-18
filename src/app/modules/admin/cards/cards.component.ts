import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CardService } from '../services/cards/card.service';
// import { Card } from '../models/cards/card.types';
import { CreateCardComponent } from './create-card/create-card.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  @ViewChild('cardsTable', { read: MatSort }) cardsTableSort: MatSort;


  cardsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  cardsTableColumns: string[] = ["description", "cardNumber", "currency", "amount", "status", "action"];

  isLoading: boolean = true;
  cards: any[];

  constructor(private _userService: UserService, private _cardService: CardService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getCards();
  }

  getCards() {
    this._cardService.getCards().subscribe((cards: any) => {
      this.cardsDataSource.data = cards;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.cardsDataSource.sort = this.cardsTableSort;
  }

  openCreateCardDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateCardComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getCards();
      });
  }

  openEditCardDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateCardComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getCards();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this item ?",
      title: "Delete Card Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleCard(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Card delete canceled')
      }
    });
  }

  deteleCard(id: string) {
    this.isLoading = true;
    this._cardService.deleteCard(id).subscribe(response => {
      this._alertService.displayMessage('Card Deleted');
      this.getCards();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }

}
