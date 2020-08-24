
import { Component, OnInit, EventEmitter, NgZone, Input } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi } from '@fullcalendar/angular';
import { MeetingEvent } from 'src/app/model/meetingEvent';
import { Router } from '@angular/router';
import { TechIntSchedulerService } from './tech-int-scheduler.service';
declare var $: any;
@Component({
  selector: 'app-tech-int-scheduler',
  templateUrl: './tech-int-scheduler.component.html',
  styleUrls: ['./tech-int-scheduler.component.css']
})
export class TechIntSchedulerComponent implements OnInit {


  @Input() candidateEmail: string;
  
  hideEventDetailsDiv = true;
  hideEventCreateDiv = true;
  eventDetails: boolean;
  eventCreate: boolean;
  edit = false;
  event_title;
  event_date;
  start_time;
  end_time;
  dateSelect: DateSelectArg;

  savedEvents: any = [];

  dummyEvents = []

  constructor(private router: Router,
    private ngZone: NgZone,
    private techIntSchedulerService: TechIntSchedulerService) { }


  ngOnInit(): void {


    
    
    
  }

  calendarApi: CalendarApi;

  eventID = 0;

  //interviewEvent: InterviewEvent[];

  calendarOptions: CalendarOptions = {
        height: 450,
        aspectRatio:2,
      
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    navLinks: true,
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    initialView: 'timeGridWeek',
    //dateClick: this.handleEventRemove.bind(this), // bind is important!
    // eventAdd: this.onEventAdd.bind(this),
    eventsSet: this.handleEvents.bind(this),
    select: this.handleDateClick.bind(this),
    eventClick: this.handleEventRemove.bind(this),
    events: this.handleEvents.bind(this),
    validRange: {
      start: new Date()
    },

    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
},
//slotLabelFormat: {hour: 'numeric', minute: '2-digit', hour12: false}
    
  };

  currentEvents: EventApi[] = [];


  //Date handler to create the events

  handleDateClick(selectInfo: DateSelectArg) {
    this.dateSelect = selectInfo;
    this.event_date = this.dateSelect.startStr;

    if (selectInfo.view.type == 'dayGridMonth') {
      $("#eventCreate").modal("show");
    }

  }


  //On date selection
  handleEvents(selectInfo: DateSelectArg) {
    //get events for the candidates from database

    console.log('candidateEmail*****',this.candidateEmail);

    
    this.techIntSchedulerService.getMeetingEventsByCandidate(this.candidateEmail).subscribe(res => {
      this.savedEvents = res;

      this.savedEvents.forEach((events) => {
        let str = { title: events.eventTitle, start: events.startDate + 'T' + events.startTime, end: events.startDate + 'T' + events.endTime };
        this.dummyEvents.push(str)
      });

      this.calendarOptions.events = this.dummyEvents;

    }, (error) => {
      console.log(error);
    });

    //******************** */

  }

  onEventAdd(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to ADD the event '${clickInfo.event}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEventRemove(clickInfo: EventClickArg) {
    $("#eventDetails").modal("show");

    /// if (confirm(`Are you sure you want to delete the event '${clickInfo.event}'`)) {
    //  clickInfo.event.remove();
    //}
  }


  addNewEvent() {

    let dateSelectArg: DateSelectArg;
    var eventTitle = this.dateSelect.view.calendar.getEventById(this.eventID++ + '');
    if (eventTitle) {
    }

    const calendarApi = this.dateSelect.view.calendar;

    if (this.event_title) {
      calendarApi.addEvent({
        id: String(this.eventID),
        title: this.event_title,
        start: this.dateSelect.startStr + 'T' + (this.start_time),
        end: this.dateSelect.startStr + 'T' + this.end_time,

      });
    }
    //Save meeting events into database
    let data;
    let meetingEvent = new MeetingEvent(String(this.eventID), this.event_title, this.dateSelect.startStr, this.start_time, 
    this.end_time,this.candidateEmail);
    data = JSON.stringify(meetingEvent);

    this.techIntSchedulerService.createMeetingEvents(data).subscribe(res => {

    }, (error) => {
      console.log(error);
    });


    let str = { title: this.event_title, start: this.dateSelect.startStr + 'T' + this.start_time, end: this.dateSelect.startStr + 'T' + this.end_time };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;

    $("#eventCreate").modal("hide");
  }


  closeCreateModal() {
    $("#eventCreate").modal("hide")
  }

  closeEditModal() {
    $("#eventDetails").modal("hide")
  }


  
}
