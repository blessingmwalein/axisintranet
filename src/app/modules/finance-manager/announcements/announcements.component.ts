import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'app/modules/admin/services/departments/department.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import moment from 'moment';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  announcements: any[];
  loading =true;
  constructor(
    private announcementService: DepartmentService,
    private alertService:AlertService
  ) { }

  ngOnInit() {
    this.getAnnouncements()
  }

  getAnnouncements(){
    this.loading = true;
    this.announcementService.getAnnouncementsPaginated(50).subscribe(announcements=>{
      this.announcements = announcements;
      this.loading = false;
    }, error=> {
      this.loading =false;
      console.log(error);
      this.alertService.displayError("Failed to load announcement reload")
      
    })
  }

  isSameDay(current: string, compare: string): boolean
  {
      return moment(current, moment.ISO_8601).isSame(moment(compare, moment.ISO_8601), 'day');
  }

  /**
   * Get the relative format of the given date
   *
   * @param date
   */
  getRelativeFormat(date: string): string
  {
      const today = moment().startOf('day');
      const yesterday = moment().subtract(1, 'day').startOf('day');

      // Is today?
      if ( moment(date, moment.ISO_8601).isSame(today, 'day') )
      {
          return 'Today';
      }

      // Is yesterday?
      if ( moment(date, moment.ISO_8601).isSame(yesterday, 'day') )
      {
          return 'Yesterday';
      }

      return moment(date, moment.ISO_8601).fromNow();
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
