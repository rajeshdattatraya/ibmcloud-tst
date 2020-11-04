
import { Component, OnInit, EventEmitter, NgZone, Input } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi, EventHoveringArg } from '@fullcalendar/angular';
import { MeetingEvent } from 'src/app/model/meetingEvent';
import { Router } from '@angular/router';
import { TechIntSchedulerService } from './tech-int-scheduler.service';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { scheduled } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-tech-int-scheduler',
  templateUrl: './tech-int-scheduler.component.html',
  styleUrls: ['./tech-int-scheduler.component.css']
})
export class TechIntSchedulerComponent implements OnInit {



  hours = Array(24).fill(0).map(({ }, i) => (i < 10) ? '0' + i : i)
  //mins = Array(60).fill(0).map(({}, i) =>  (i < 10) ?'0'+i: i)
  meridian = ['AM', 'PM']

  @Input() candidateEmail: string;
  @Input() candidateName: string;

  hideEventDetailsDiv = true;
  hideEventCreateDiv = true;
  eventDetails: boolean;
  eventCreate: boolean;
  edit = false;
  event_title = "";
  start_AMPM = "";
  end_AMPM = "";
  event_date;
  start_time;
  end_time;
  dateSelect: DateSelectArg;
  startDate;
  time: any = [];
  savedEvents: any = [];
  dummyEvents: any = []

  calendarApi: CalendarApi;

  eventID = 0;
  eventIDToUpdate = 0;

  eventData;
  //to send meeting invite details via email
  fromAddress;
  toAddress;
  emailSubject = "";
  emailMessage;
  userName;
  accessLevel;
  account;

 eventTitle = "";
 interviewDate = "";


  constructor(private router: Router,
    private ngZone: NgZone,
    private techIntSchedulerService: TechIntSchedulerService) {

    this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    this.account = this.router.getCurrentNavigation().extras.state.account;
    this.fromAddress = this.router.getCurrentNavigation().extras.state.username;
    this.userName = this.fromAddress


    for (let hh = 0; hh < 12; hh++) {
      var hour = (hh < 10) ? '0' + hh : hh;
      var time = [hour + ':00', hour + ':15', hour + ':30', hour + ':45'];

      time.forEach(t => {
        this.time.push(t)
      });

    }

  }

  ngOnInit(): void {

  }



  calendarOptions: CalendarOptions = {
    height: 450,
    aspectRatio: 2,

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
    initialView: 'dayGridMonth',
    select: this.handleDateClick.bind(this),
    //dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventUpdate.bind(this),
    events: this.handleEvents.bind(this),
    validRange: {
      start: new Date()
    },
    eventMouseEnter:this.handleToolTip.bind(this),
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    
    //slotLabelFormat: {hour: 'numeric', minute: '2-digit', hour12: false}

  };

  handleToolTip(eventHoverInfo: EventHoveringArg) {
    console.log(`eventHoverInfo`, eventHoverInfo);

    var event = eventHoverInfo.event

    $(eventHoverInfo.el).tooltip({title: event.title}); 
  }



  currentEvents: EventApi[] = [];


  //Date handler to create the events
  handleDateClick(selectInfo: DateSelectArg) {
    this.dateSelect = selectInfo;
    this.event_date = this.dateSelect.startStr;
    this.event_title = this.eventTitle;

    if (this.interviewDate != undefined || this.interviewDate == "") {
      alert ("Technical interview for the candidate is already scheduled for " +this.interviewDate)
    } else if (selectInfo.view.type == 'dayGridMonth') {
      $("#eventCreate").modal("show");
    }

  }


  //On date selection
  handleEvents(selectInfo: DateSelectArg) {

  }

  onEventAdd(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to ADD the event '${clickInfo.event}'`)) {
      clickInfo.event.remove();
    }
  }


  handleEventUpdate(clickInfo: EventClickArg) {
    var startTime = clickInfo.event.startStr.split('T')[1].slice(0, 8);
    var endTime = clickInfo.event.endStr.split('T')[1].slice(0, 8);
    this.eventIDToUpdate = Number(clickInfo.event.id);

   
    var startTimeAMPM = this.timeIn12HourFormat(startTime)
    var endTimeAMPM = this.timeIn12HourFormat(endTime)

      this.start_time = startTimeAMPM.split(' ')[0];
      this.start_AMPM = startTimeAMPM.split(' ')[1];
    
      this.end_time = endTimeAMPM.split(' ')[0];
      this.end_AMPM = endTimeAMPM.split(' ')[1];
    
    this.startDate = clickInfo.event.startStr.split('T')[0];
    this.event_title = clickInfo.event.title;

    this.calendarApi = clickInfo.view.calendar;

    $("#eventDetails").modal("show")

  }


  //update calendar events
  updateEvent() {

    this.toAddress = this.candidateEmail;
    
    var startTime = this.start_time;
    var endTime = this.end_time;
    this.start_time = this.timeIn24HourFormat(this.start_time, this.start_AMPM)
    this.end_time = this.timeIn24HourFormat(this.end_time, this.end_AMPM)
    
    if (this.end_time <= this.start_time || this.end_time ==  undefined && this.start_time ==  undefined) {
      this.start_time = startTime;
      this.end_time = endTime;
      alert('End Time must be later than the Start Time')
      return ;
    }

    this.calendarApi.getEventById(this.eventIDToUpdate + '').remove();
    
    let str = {
      id: this.eventIDToUpdate, title: this.event_title,
      start: this.startDate + 'T' + this.start_time,
      end: this.startDate + 'T' + this.end_time
    };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;

    let updateMeetingEvent = new MeetingEvent(this.eventIDToUpdate, this.event_title, this.startDate, this.start_time,
      this.end_time, this.candidateEmail, this.fromAddress);
    let updateEventData = JSON.stringify(updateMeetingEvent);

    this.techIntSchedulerService.updateMeetingEventsByEventID(this.eventIDToUpdate, this.candidateEmail, updateEventData).subscribe(res => {

      this.emailSubject = " Rescheduled Technical SME Interview  ";
      this.emailMessage = "Dear Employee, <br><p> This is to formally notify that the technical interview has been "
        + " rescheduled to the following date and time:</p><br>"
        + " Date : " + this.dateSelect.startStr + "<br>"
        + "Time: " + updateMeetingEvent.startTime + " to " + updateMeetingEvent.endTime + "<br>"
        + "<br>Please DO NOT REPLY, this is a system generated email."
        + "<br>In case of any queries please write to: <b>" + this.fromAddress + ".</b>"
        + "<p>Regards, <br>" + this.account + " Team </p>";

      this.techIntSchedulerService.sendMeetingInviteEmail(this.fromAddress, this.toAddress, this.emailSubject,
        this.emailMessage);

    }, (error) => {
      console.log(error);
    });


    if (this.event_title) {
      this.calendarApi.addEvent({
        id: this.eventIDToUpdate + '',
        title: this.event_title,
        start: this.startDate + 'T' + (this.start_time),
        end: this.startDate + 'T' + this.end_time,

      });
    }

    this.event_title = "";
    this.start_time = " ";
    this.end_time = " ";

    $("#eventDetails").modal("hide")

  }



  //Add new calendar events
  addNewEvent() {

    
    this.toAddress = this.candidateEmail;

    this.eventIDToUpdate = 0;
    this.eventID = this.dummyEvents.length;
    this.eventID = this.eventID + 1;
    this.eventData = undefined;

    this.calendarApi = this.dateSelect.view.calendar;

    


    //To convert 12hour format to 24 hour format
    //If the start time is say "03:45 PM" then it will be converted into "15:45"
    this.start_time = this.timeIn24HourFormat(this.start_time, this.start_AMPM)
    this.end_time = this.timeIn24HourFormat(this.end_time, this.end_AMPM)

    if (this.end_time <= this.start_time) {
      alert('End Time must be later than the Start Time')
      return false;
    }

    if (this.event_title) {
      this.calendarApi.addEvent({
        id: this.eventID + '',
        title: this.event_title,
        start: this.dateSelect.startStr + 'T' + (this.start_time),
        end: this.dateSelect.startStr + 'T' + this.end_time,

      });
    }
    //Save meeting events into database
    let data;
    let meetingEvent = new MeetingEvent(this.eventID, this.event_title, this.dateSelect.startStr, this.start_time,
      this.end_time, this.candidateEmail, this.fromAddress);
    data = JSON.stringify(meetingEvent);

    this.techIntSchedulerService.createMeetingEvents(data).subscribe(res => {
      this.emailSubject = " Technical SME Interview  ";
      this.emailMessage = "Dear Employee, <br><p> This is to formally notify that a technical interview has been "
        + " scheduled on the following date and time:</p><br>"
        + " Date : " + this.dateSelect.startStr + "<br>"
        + "Time: " + meetingEvent.startTime + " to " + meetingEvent.endTime + "<br>"
        + "<br>Please DO NOT REPLY, this is a system generated email."
        + "<br>In case of any queries please write to: <b>" + this.fromAddress + ".</b>"
        + "<p>Regards, <br>" + this.account + " Team </p>";

      this.techIntSchedulerService.sendMeetingInviteEmail(this.fromAddress, this.toAddress, this.emailSubject,
        this.emailMessage);
    }, (error) => {
      console.log(error);
    });


    let str = { id: this.eventID, title: this.event_title, start: this.dateSelect.startStr + 'T' + this.start_time, end: this.dateSelect.startStr + 'T' + this.end_time };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;

    this.interviewDate = this.dateSelect.startStr;
    //this.event_title = "";
    this.start_time = "";
    this.end_time = "";
    this.dateSelect.view.calendar.unselect()
    $("#eventCreate").modal("hide");
  }


  timeIn24HourFormat(timeIn12hourFormat, ampm): string {
    var timeIn24HourFormat;
    if (ampm == 'PM' && timeIn12hourFormat.split(':')[0] < 12) {
      timeIn24HourFormat = Number(timeIn12hourFormat.split(':')[0]) + 12 + ':' + timeIn12hourFormat.split(':')[1];
    } else if (ampm == 'AM'){
      timeIn24HourFormat = timeIn12hourFormat;
    }

    return timeIn24HourFormat;
  }

  timeIn12HourFormat(timeIn24hourFormat): string {
    var timeIn12HourFormat;
    var hours = Number(timeIn24hourFormat.split(':')[0]);
    var mins = Number(timeIn24hourFormat.split(':')[1]);
  
    if (hours >= 12) {
      timeIn12HourFormat = (((hours - 12) < 10) ? '0' + (hours - 12) : hours - 12) + ':' 
      + ((mins < 10) ? '0' + mins: mins) +' PM';
    } else {
      timeIn12HourFormat = ((hours < 10) ? '0' + hours : hours) + ':' + ((mins < 10) ? '0' + mins: mins)+' AM';
    }

    return timeIn12HourFormat;
  }

  closeCreateModal() {
    this.eventID = 0;
    //this.event_title = "";
    this.start_time = "";
    this.end_time = "";
    this.dateSelect.view.calendar.unselect()
    $("#eventCreate").modal("hide")
  }

  closeEditModal() {
   // this.eventID = 0;
    //this.event_title = "";
    this.start_time = "";
    this.end_time = "";
    
   // this.dateSelect.view.calendar.unselect()
    $("#eventDetails").modal("hide")
  }




  /* This method will be called on load of the calendar
  Since it is child component of SME tech interview component, 
  ngInit and the constructor methods will be calle only on load of parent component
  Hence this method is used to reset and reload the calendar events on loading calendar window*/
  handleCandidateEvents(emailSelected: string, calEmployeeName : string, interviewDate :  string) {


   // this.eventTitle = "Tech Interview with "+calEmployeeName;
   this.interviewDate = interviewDate;
    this.eventTitle = calEmployeeName;
    this.event_title = this.eventTitle;
    this.calendarOptions.events = [];
    this.dummyEvents = [];
    //get the saved events from database for the selected candidate
    this.techIntSchedulerService.getMeetingEventsByLoggedInUser(this.userName).subscribe(res => {
      this.savedEvents = res;

      this.savedEvents.forEach((event) => {
        let str = {id: event.eventID, title: event.eventTitle, start: event.startDate + 'T' + event.startTime, end: event.startDate + 'T' + event.endTime };
        this.dummyEvents.push(str)
      });
      this.eventID = this.savedEvents.length;
      this.calendarOptions.events = this.dummyEvents;

    }, (error) => {
      console.log(error);
    });

    setTimeout(function () {
      $("button.fc-dayGridMonth-button").click();
    }, 900);



  }


  //This method will be called on closure of Calendar window
  //this will clear all the cached event from calendar API
  closeCalendar() {
    if (this.dateSelect != undefined) {
      this.dateSelect.view.calendar.removeAllEvents();
    }

  }

}
