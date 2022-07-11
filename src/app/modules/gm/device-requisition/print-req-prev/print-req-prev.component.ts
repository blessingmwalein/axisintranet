import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-print-req-prev',
  templateUrl: './print-req-prev.component.html',
  styleUrls: ['./print-req-prev.component.scss']
})
export class PrintReqPrevComponent implements OnInit {

  deviceRequisition: any;
  constructor(
    public matDialogRef: MatDialogRef<PrintReqPrevComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit() {
    this.deviceRequisition = this.data.deviceRequisition
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  captureScreen() {
    let data = document.getElementById('contentToConvert');
    html2canvas(data as any).then(canvas => {
      var imgWidth = 210;
      var pageHeight = 400;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdfData = new jsPDF('p', 'mm', 'a4');
      var position = 0;
      pdfData.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdfData.save(`device-requisition-${this.deviceRequisition.id}.pdf`);
    });
  }
}
