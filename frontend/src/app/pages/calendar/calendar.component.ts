import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { TaskService } from 'src/app/task.service';
import { AuthService } from 'src/app/auth.service'
import { formatDate } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  Events: any[] = [];

  constructor(private taskService: TaskService, private authService: AuthService) {

  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  };

  ngOnInit(): void {
    const userId = this.authService.getUserId()

    if (userId) {
      this.taskService.getAllByUsuarioId(userId).subscribe((tasks: any) => {


        tasks.forEach((task: any) => {
          const { title, data } = task
          const dateTask = data.slice(0, 10)
          this.Events.push({ title, date: dateTask })
        })

        this.calendarOptions = {
          initialView: 'dayGridMonth',
          events: this.Events
        };
      })
    }
  }
}
