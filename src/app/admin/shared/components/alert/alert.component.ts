import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AlertService, AlertType} from "../../services/alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 5000
  text: string
  type: AlertType
  alertSub: Subscription

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.alertSub = this.alertService.alert$.subscribe(alertInstance => {
      this.type = alertInstance.type
      this.text = alertInstance.text

      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        this.text = ''
      }, this.delay)
    })
  }

  ngOnDestroy(): void {
    if (this.alertSub) {
      this.alertSub.unsubscribe()
    }
  }

}
