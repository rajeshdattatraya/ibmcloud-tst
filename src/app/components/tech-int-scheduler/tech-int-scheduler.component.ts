
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
  @Input() candidateName: string;
  
  hideEventDetailsDiv = true;
  hideEventCreateDiv = true;
  eventDetails: boolean;
  eventCreate: boolean;
  edit = false;
  event_title = "";
  event_date;
  start_time;
  end_time;
  dateSelect: DateSelectArg;
  startDate;

  savedEvents: any = [];

  dummyEvents = []

  calendarApi: CalendarApi;

  eventID = 0;
  eventIDToUpdate = 0;

  eventData;
//to send meeting invite details via email
fromAddress;
toAddress;
 emailSubject=" Technical SME Interview ";
 emailMessage;
 userName;
 accessLevel;
 account;

  constructor(private router: Router,
    private ngZone: NgZone,
    private techIntSchedulerService: TechIntSchedulerService)
     { 

      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      this.account = this.router.getCurrentNavigation().extras.state.account;
      this.fromAddress = this.router.getCurrentNavigation().extras.state.username;
      
    }


  ngOnInit(): void {
    this.event_title = "Tech Interview with " + this.candidateName;
    
  }


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
    initialView: 'dayGridMonth',
    //dateClick: this.handleEventRemove.bind(this), // bind is important!
    // eventAdd: this.onEventAdd.bind(this),
    //eventsSet: this.handleEvents.bind(this),
    select: this.handleDateClick.bind(this),
    eventClick: this.handleEventUpdate.bind(this),
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
    this.dummyEvents = []
    
    this.techIntSchedulerService.getMeetingEventsByCandidate(this.candidateEmail).subscribe(res => {
      this.savedEvents = res;

      this.savedEvents.forEach((events) => {
        let str = { id: events.eventID, title: events.eventTitle, start: events.startDate + 'T' + events.startTime, end: events.startDate + 'T' + events.endTime };
        this.dummyEvents.push(str)
      });

      this.calendarOptions.events = this.dummyEvents;
    }, (error) => {
      console.log(error);
    });

    
  }

  onEventAdd(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to ADD the event '${clickInfo.event}'`)) {
      clickInfo.event.remove();
    }
  }
  

  handleEventUpdate(clickInfo: EventClickArg) {
    
    
    this.start_time = clickInfo.event.startStr.split('T')[1].slice(0,8);
    this.end_time = clickInfo.event.endStr.split('T')[1].slice(0,8);
    this.eventIDToUpdate = Number(clickInfo.event.id);

    this.startDate = clickInfo.event.startStr.split('T')[0];
    this.event_title = clickInfo.event.title;
    

    this.calendarApi = clickInfo.view.calendar;

   
    $("#eventDetails").modal("show")
    
  }


//update calendar events
  updateEvent() {

    this.toAddress = this.candidateEmail;
    this.calendarApi.getEventById(this.eventIDToUpdate + '').remove();
    
    let str = { id: this.eventIDToUpdate, title: this.event_title, 
      start: this.startDate + 'T' + this.start_time, 
      end: this.startDate + 'T' + this.end_time };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;
   


    let updateMeetingEvent = new MeetingEvent(this.eventIDToUpdate, this.event_title, this.startDate, this.start_time, 
      this.end_time,this.candidateEmail);
      let updateEventData = JSON.stringify(updateMeetingEvent);

      this.techIntSchedulerService.updateMeetingEventsByEventID(this.eventIDToUpdate, this.candidateEmail, updateEventData).subscribe(res => {

        this.emailSubject=" Rescheduled Technical SME Interview  ";
        this.emailMessage = "Dear Employee, <br><p> This is to formally notify that the technical interview has been "
     +" rescheduled to the folowing date and time:</p><br>"
      +" Date : "+ this.startDate +"<br>"
      + "Time: "+ this.start_time +"<br>"
      + "<p>Regards, <br>"+this.account+" Team </p>"; 

      this.techIntSchedulerService.sendMeetingInviteEmail(this.fromAddress,this.toAddress, this.emailSubject, 
        this.emailMessage );

      }, (error) => {
        console.log(error);
      });


    if (this.event_title) {
      this.calendarApi.addEvent({
        id: this.eventIDToUpdate + '',
        title: this.event_title,
        start: this.startDate + 'T' + (this.start_time),
        end: this.startDate+ 'T' + this.end_time,

      });
    }

    

    $("#eventDetails").modal("hide")

  }



//Add new calendar events
  addNewEvent() {

    this.toAddress = this.candidateEmail;

      this.eventIDToUpdate = 0;
      this.eventID = this.dummyEvents.length;
      this.eventID = this.eventID + 1;
      this.eventData=undefined;

    this.calendarApi = this.dateSelect.view.calendar;

    if (this.event_title) {
      this.calendarApi.addEvent({
        id: this.eventID+'',
        title: this.event_title,
        start: this.dateSelect.startStr + 'T' + (this.start_time),
        end: this.dateSelect.startStr + 'T' + this.end_time,

      });
    }
    //Save meeting events into database
    let data;
    let meetingEvent = new MeetingEvent(this.eventID, this.event_title, this.dateSelect.startStr, this.start_time, 
    this.end_time,this.candidateEmail);
    data = JSON.stringify(meetingEvent);

    this.techIntSchedulerService.createMeetingEvents(data).subscribe(res => {

      this.emailMessage = "Dear Employee, <br><p> This is to formally notify that a technical interview has been "
     +" scheduled on the folowing date and time:</p><br>"
      +" Date : "+ this.dateSelect.startStr +"<br>"
      + "Time: "+ this.start_time +"<br>"
      + "<p>Regards, <br>"+this.account+" Team </p>"; 

      this.techIntSchedulerService.sendMeetingInviteEmail(this.fromAddress,this.toAddress, this.emailSubject, 
        this.emailMessage );
    }, (error) => {
      console.log(error);
    });


    let str = { id:this.eventID, title: this.event_title, start: this.dateSelect.startStr + 'T' + this.start_time, end: this.dateSelect.startStr + 'T' + this.end_time };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;

    this.event_title = " " ;
    this.start_time = " " ;
    this.end_time = " " ;

    $("#eventCreate").modal("hide");
  }


  closeCreateModal() {
    $("#eventCreate").modal("hide")
  }

  closeEditModal() {
    $("#eventDetails").modal("hide")
  }


  
}
