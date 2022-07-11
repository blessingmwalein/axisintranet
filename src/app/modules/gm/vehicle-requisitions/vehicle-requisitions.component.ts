import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-vehicle-requisitions',
  templateUrl: './vehicle-requisitions.component.html',
  styleUrls: ['./vehicle-requisitions.component.scss'],
  encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleRequisitionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
