var _ = require('underscore');

module.exports = function($scope, socket, $compile, toaster){

  var uiCalendar = $("[ui-calendar]");

  $scope.calendarSources = {};
  $scope.calendars = [];
  $scope.events = [];

  $scope.modal = null;

  $scope.uiConfig = {
    calendar:{
      // height: 250,
      lang: navigator.language || navigator.userLanguage || 'en',
      editable: true,
      header:{
        left: 'title',
        center: '',
        right: 'month,agendaWeek,agendaDay today prev,next'
      },
      firstDay: 1, //Monday
      aspectRatio: 1.75,
      //Events
      eventRender: eventRender, 
      eventClick: eventClick,
      eventResize: eventResizeAndDrop,
      eventDrop: eventResizeAndDrop
    }
  };

  // Start : Event

  function eventRender(view, element){
    if(uiCalendar.fullCalendar('getView').intervalUnit != "month"){

      var descriptionHTML = "";
      if(view.description != null){
        descriptionHTML += view.description;
      }
      if(view.description != null && view.location != null){
        descriptionHTML += "<br>";
      }
      if(view.location != null){
        descriptionHTML += "("+view.location + ")";
      }

      var p = document.createElement('p');
      p.innerHTML = descriptionHTML;

      element[0].appendChild(p);
    }
  }

  function initDateRangePicker(event){
    var options = {
      timeZone: jstz.determine().name(),
      showDropdowns: true,
      autoApply: true,
      timePicker: true,
      timePickerIncrement: 5,
      format: 'MM/DD/YYYY h:mm A',
      locale: {
        format: 'MM/DD/YYYY h:mm A'
      }
    };
    if(event != null){
      if(event.start != null)
        options.startDate = event.start;
      if(event.end != null)
        options.endDate = event.end;
    }
    $('input[datetimerange]').daterangepicker(options);
  };

  function eventClick(calEvent, jsEvent, view){
    $scope.modal = calEvent;
    $scope.modal.editable = calEvent.calendar.accessRole == "writer" || calEvent.calendar.accessRole == "owner"
    $('input[datetimerange]').val(calEvent.start.format('MM/DD/YYYY h:mm A') + " - " + calEvent.end.format('MM/DD/YYYY h:mm A'))
    initDateRangePicker(calEvent);

    $scope.$apply();
  }

  function eventResizeAndDrop(event, delta, revertFunc){
    var timeZone = jstz.determine().name();
    var newEvent = {
      nend: {
        dateTime: event.end.toISOString(),
        timeZone: timeZone
      },
      nstart: {
        dateTime: event.start.toISOString(),
        timeZone: timeZone
      },
      googleEvent: event.googleEvent
    } 
    socket.emit('calendar/google/event/edit', event.calendar, newEvent, function(err, res){
      if(err){
        console.error(err);
        toaster.pop('error', 'Error', 'Cannot edit this event');
        revertFunc();
        return;
      }
    });
  }

  // End : Event

  uiCalendar.fullCalendar($scope.uiConfig.calendar);

  socket.emit('calendar/list', function(err, list){
    if(err){
      console.error(err);
      toaster.pop('error', 'Error', 'Cannot list calendars')
      return
    }
    $scope.calendars = list;

    for(var i in list){
      var calendar = list[i];

      $scope.calendarSources[calendar.calendarId] = {
        events: [], 
        eventsById: {}, 
        editable: calendar.accessRole == "writer" || calendar.accessRole == "owner", 
        currentTimezone: 'Europe/Paris',
        color: calendar.color
      };
      updateEventSource($scope.calendarSources[calendar.calendarId], true);
      socket.emit('calendar/google/events/year', calendar, function(err){
        if(err){
          console.error(err);
          toaster.pop('error', 'Error', 'Cannot list calendar "' + calendar.name + '" events');
          return
        }
      }); 
    }

  });

  socket.on('calendar/google/events/year', function(calendar, events){
      uiCalendar.fullCalendar('removeEventSource', $scope.calendarSources[calendar.calendarId]);

      for(var i in events){
        var googleEvent = events[i];
        $scope.calendarSources[calendar.calendarId].eventsById[googleEvent.iCalUID] = parseGoogleEvent(googleEvent, calendar);
      }
      $scope.calendarSources[calendar.calendarId].events = _.values($scope.calendarSources[calendar.calendarId].eventsById);
      uiCalendar.fullCalendar('addEventSource', $scope.calendarSources[calendar.calendarId]);

    })

  function updateEventSource(source, create){
    uiCalendar.fullCalendar('removeEventSource', source);
    uiCalendar.fullCalendar('addEventSource', source);
  }

  function parseGoogleEvent(googleEvent, calendar){
    return {
      title: googleEvent.summary,
      location: googleEvent.location,
      description: googleEvent.description,
      start: new Date(googleEvent.start.dateTime),
      end: new Date(googleEvent.end.dateTime),
      calendar: calendar,
      className: "pointer",
      googleEvent: googleEvent
    };
  }
  

  $scope.createEvent = function(calendar){

    var newEvent = {
      calendar: calendar,
      isNew: true,
      editable: true
    }

    $scope.modal = newEvent;
    initDateRangePicker();
  }

  function modalNewEvent(){
    var newEvent = $scope.modal;
    if(newEvent.title == null){
      toaster.pop('error', 'Error', 'You need a event title');
      return;
    }
    newEvent.summary = newEvent.title;
    var timeZone = jstz.determine().name();
    var newDate = $('input[datetimerange]').data('daterangepicker');
    if(newDate.startDate == null || newDate.endDate == null){
      toaster.pop('error', 'Error', 'You need a event start and end date');
      return;
    }
    newEvent.start = {
      dateTime: newDate.startDate.toISOString(),
      timeZone: timeZone
    };
    newEvent.end = {
      dateTime: newDate.endDate.toISOString(),
      timeZone: timeZone
    };  

    var calendar = newEvent.calendar;
    delete newEvent['calendar'];
    socket.emit('calendar/google/event/create', calendar, newEvent, function(err, googleEvent){
      if(err){
        toaster.pop('error', 'Error', 'Cannot create this event');
        console.error(err);
        return;
      }
      var event = parseGoogleEvent(googleEvent, calendar);
      event.color = calendar.color;
      $scope.calendarSources[calendar.calendarId].eventsById[googleEvent.iCalUID] = event;
      $scope.calendarSources[calendar.calendarId].events = _.values($scope.calendarSources[calendar.calendarId].eventsById);
      uiCalendar.fullCalendar('renderEvent', event);

      $scope.modal = null;
    })
  }

  $scope.modalEdit = function(){
    delete $scope.modal['source']; //Circular and useless for edit packet
    if($scope.modal['isNew'] != null && $scope.modal['isNew']){
      modalNewEvent();
      return;
    }
    var event = $scope.modal;
    var timeZone = jstz.determine().name();
    var newDate = $('input[datetimerange]').data('daterangepicker');
    event.nstart = {
      dateTime: newDate.startDate.toISOString(),
      timeZone: timeZone
    };
    event.nend = {
      dateTime: newDate.endDate.toISOString(),
      timeZone: timeZone
    };
    socket.emit('calendar/google/event/edit', event.calendar, event, function(err, res){
      if(err){
        toaster.pop('error', 'Error', 'Cannot edit this event');
        return; 
      }
      $scope.modal = null;

      uiCalendar.fullCalendar('removeEventSource', $scope.calendarSources[event.calendar.calendarId]);
      event.start = newDate.startDate;
      event.end = newDate.endDate;
      event.color = event.calendar.color;
      uiCalendar.fullCalendar('updateEvent', event);


    })
  }

  $scope.modalDelete = function(){
    delete $scope.modal['source']; //Circular and useless for edit packet
    if($scope.modal['isNew'] != null && $scope.modal['isNew']){
      return;
    }
    if(!confirm('Are you sure to delete this event ?')){
      return;
    }
    socket.emit('calendar/google/event/delete', $scope.modal.calendar, $scope.modal, function(err){
      if(err){
        toaster.pop('error', 'Error', 'Cannot delete this event');
        return;
      }
      uiCalendar.fullCalendar( 'removeEvents', $scope.modal._id);
      $scope.modal = null;

    })

  }


}

