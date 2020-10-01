
import { Component, OnInit, EventEmitter, NgZone, Input } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi } from '@fullcalendar/angular';
import { MeetingEvent } from 'src/app/model/meetingEvent';
import { Router } from '@angular/router';
import { TechIntSchedulerService } from './tech-int-scheduler.service';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";

declare var $: any;
@Component({
  selector: 'app-tech-int-scheduler',
  templateUrl: './tech-int-scheduler.component.html',
  styleUrls: ['./tech-int-scheduler.component.css']
})
export class TechIntSchedulerComponent implements OnInit {

  

  hours = Array(24).fill(0).map(({}, i) =>  (i < 10) ?'0'+i: i) 
  //mins = Array(60).fill(0).map(({}, i) =>  (i < 10) ?'0'+i: i)
meridian = ['AM','PM']

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
 emailSubject="";
 emailMessage;
 userName;
 accessLevel;
 account;


 //Array(24).fill(0).map(({}, i)

 

  constructor(private router: Router,
    private ngZone: NgZone,
    private techIntSchedulerService: TechIntSchedulerService)
     { 

      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      this.account = this.router.getCurrentNavigation().extras.state.account;
      this.fromAddress = this.router.getCurrentNavigation().extras.state.username;


      for(let hh=0; hh<12;hh++){
        var hour = (hh < 10) ?'0'+hh: hh ;
        var time = [hour+':00', hour+':15', hour+':30', hour+':45'];
      
        time.forEach(t => {
          this.time.push(t)
        });
            
      }

  }

  ngOnInit(): void {

  }



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
    select: this.handleDateClick.bind(this),
    //dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventUpdate.bind(this),
    events: this.handleEvents.bind(this),
    validRange: {
      start: new Date()
    },

    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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
    
    this.dummyEvents = [];
    
    this.techIntSchedulerService.getMeetingEventsByLoggedinUSer(this.fromAddress).subscribe(res => {
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
    var startTime = clickInfo.event.startStr.split('T')[1].slice(0,8);
    var endTime = clickInfo.event.endStr.split('T')[1].slice(0,8);
    this.eventIDToUpdate = Number(clickInfo.event.id);
    
    var startTimeNum = Number(startTime.split(':')[0]);
    var endTimeNum = Number(endTime.split(':')[0]);

    if (startTimeNum >= 12) {
      this.start_time = (((startTimeNum-12) <10) ? '0'+ (startTimeNum-12) : startTimeNum-12 ) + ':'+ startTime.split(':')[1];
      this.start_AMPM='PM'
    } else {
      this.start_AMPM='AM';
    this.start_time = ((startTimeNum <10) ? '0'+ startTimeNum : startTimeNum ) + ':'+ startTime.split(':')[1];;
    }
   
    if (endTimeNum >= 12) {
     // var endTimeStr = 
      this.end_time = (((endTimeNum-12) <10) ? '0'+ (endTimeNum-12) : endTimeNum-12 ) + ':'+ endTime.split(':')[1];
      console.log('insied this.end_time*** ', this.end_time);
      this.end_AMPM='PM'
    } else  {
      this.end_AMPM='AM';
      this.end_time = ((endTimeNum <10) ? '0'+ endTimeNum : endTimeNum )  + ':'+ endTime.split(':')[1];
    }

    this.startDate = clickInfo.event.startStr.split('T')[0];
    this.event_title = clickInfo.event.title;

    this.calendarApi = clickInfo.view.calendar;


   
    $("#eventDetails").modal("show")
    
  }


//update calendar events
  updateEvent() {

    this.toAddress = this.candidateEmail;
    this.calendarApi.getEventById(this.eventIDToUpdate + '').remove();

    var startTimeAMPM = this.start_time
    if(this.start_AMPM == 'PM' && startTimeAMPM.split(':')[0] < 12) {
      this.start_time= Number(this.start_time.split(':')[0])+12+ ':'+this.start_time.split(':')[1] ;
    }
    
    var endTimeAMPM = this.end_time
    if(this.end_AMPM == 'PM' && endTimeAMPM.split(':')[0] < 12) {
      this.end_time= Number(this.end_time.split(':')[0])+12+ ':'+this.end_time.split(':')[1] ;
    }

    
    
    let str = { id: this.eventIDToUpdate, title: this.event_title, 
      start: this.startDate + 'T' + this.start_time, 
      end: this.startDate + 'T' + this.end_time };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;

    let updateMeetingEvent = new MeetingEvent(this.eventIDToUpdate, this.event_title, this.startDate, this.start_time, 
      this.end_time,this.candidateEmail, this.fromAddress);
      let updateEventData = JSON.stringify(updateMeetingEvent);

      this.techIntSchedulerService.updateMeetingEventsByEventID(this.eventIDToUpdate, this.candidateEmail, updateEventData).subscribe(res => {

        this.emailSubject=" Rescheduled Technical SME Interview  ";
        this.emailMessage = "Dear Employee, <br><p> This is to formally notify that the technical interview has been "
     +" rescheduled to the following date and time:</p><br>"
     +" Date : "+ this.dateSelect.startStr +"<br>"
     + "Time: "+ updateMeetingEvent.startTime +" to "+ updateMeetingEvent.endTime +"<br>"
     + "<br>Please DO NOT REPLY, this is a system generated email."
      + "<br>In case of any queries please write to: <b>" +this.fromAddress+".</b>"
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

    this.event_title = "" ;
    this.start_time = " " ;
    this.end_time = " " ;

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
    var startTimeAMPM = this.start_time
console.log('BEFORE this.start_time*** ', this.start_time);
if(this.start_AMPM == 'PM' && startTimeAMPM.split(':')[0] < 12) {
  this.start_time= Number(this.start_time.split(':')[0])+12+ ':'+this.start_time.split(':')[1] ;
}
console.log('AFTER this.start_time*** ', this.start_time);

var endTimeAMPM = this.end_time
console.log('BEFORE this.end_time*** ', this.end_time);
if(this.end_AMPM == 'PM' && endTimeAMPM.split(':')[0] < 12) {
  this.end_time= Number(this.end_time.split(':')[0])+12+ ':'+this.end_time.split(':')[1] ;
}

console.log('AFTER this.end_time*** ', this.end_time);


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
    this.end_time,this.candidateEmail,this.fromAddress);
    data = JSON.stringify(meetingEvent);

    this.techIntSchedulerService.createMeetingEvents(data).subscribe(res => {
      this.emailSubject=" Technical SME Interview  ";
      this.emailMessage = "Dear Employee, <br><p> This is to formally notify that a technical interview has been "
     +" scheduled on the following date and time:</p><br>"
      +" Date : "+ this.dateSelect.startStr +"<br>"
      + "Time: "+ meetingEvent.startTime +" to "+ meetingEvent.endTime +"<br>"
      + "<br>Please DO NOT REPLY, this is a system generated email."
      + "<br>In case of any queries please write to: <b>" +this.fromAddress+".</b>"
      + "<p>Regards, <br>"+this.account+" Team </p>"; 

      this.techIntSchedulerService.sendMeetingInviteEmail(this.fromAddress,this.toAddress, this.emailSubject, 
        this.emailMessage );
    }, (error) => {
      console.log(error);
    });


    let str = { id:this.eventID, title: this.event_title, start: this.dateSelect.startStr + 'T' + this.start_time, end: this.dateSelect.startStr + 'T' + this.end_time };
    this.dummyEvents.push(str)

    this.calendarOptions.events = this.dummyEvents;

    this.event_title = "" ;
    this.start_time = "" ;
    this.end_time = "" ;

    $("#eventCreate").modal("hide");
  }


  closeCreateModal() {
    
    this.event_title = "" ;
    this.start_time = "" ;
    this.end_time = "" ;
    $("#eventCreate").modal("hide")
  }

  closeEditModal() {

    this.event_title = "" ;
    this.start_time = "" ;
    this.end_time = "" ;
    $("#eventDetails").modal("hide")
  }


  
}
