// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
//initial DOM variables
var currentDayEl = $('#currentDay');
var scheduleContainerEl = $('#scheduleContainer');


$(function () {
  //code to display the current date in the header of the page.
  var rightNow = dayjs().format('dddd, MMMM Do');
  currentDayEl.text(rightNow);

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  function startup() {
    var currentHour = dayjs().hour();
    for (i = 9; i < 18; i++){
      var hoursClass = dayjs().hour(i).format('H');
      var hours = dayjs().hour(i).format('hA');
      //creating the elements for each time block to be made of. Setting the ID of each time block to be the hour-i, (eg hour-9, hour-10) for future use.
      var scheduleEl = $('<div id="hour-' + i + '" class="row time-block "></div>');
      var hourDisplayEl = $('<div class="col-2 col-md-1 hour text-center py-3"></div>');
      var textAreaEl = $('<textarea class="col-8 col-md-10 description" rows="3"></textarea>');
      var saveButtonEl = $('<button class="btn saveBtn col-2 col-md-1" aria-label="save"><i class="fas fa-save" aria-hidden="true"></i></button>');
      hourDisplayEl.text(hours);

      //code to apply the past, present, or future class to each time
      // block by comparing the id to the current hour.
      if (currentHour == hoursClass){
        console.log(currentHour);
        console.log(hoursClass);
        $(scheduleEl).addClass("present");
      } 
      if (currentHour > hoursClass){
        console.log(hoursClass);
        $(scheduleEl).addClass("past");
      } else if (currentHour < hoursClass) {
        console.log(hoursClass);
        $(scheduleEl).addClass("future");
      }
      
      //appending all the elements together and building them on the page
      scheduleEl.append(hourDisplayEl, textAreaEl, saveButtonEl);
      scheduleContainerEl.append(scheduleEl);
    }
    //runs function to pull anything from local storage and displays on the page
    setScheduledEvents();
  }

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?

  
  //checks to see if anything is in local storage, and returns it as an array if so, or an empty array if the local storage is empty.
  function readScheduledEventsFromStorage(){
    var scheduledEvents = localStorage.getItem('schedule');
    if (scheduledEvents){
      scheduledEvents = JSON.parse(scheduledEvents);
    } else {
      scheduledEvents = [];
    }
    return scheduledEvents
  }

  //function that when called saves the array into local storage.
  function saveSchedule(scheduledEvents){
    localStorage.setItem('schedule', JSON.stringify(scheduledEvents));
  };

  // function to save events into local storage.uses the id in the containing time-block asa key to save the user input in
  // local storage, and saves th text value in the text area section.
  function saveEvents(){
    var scheduledEventHour = $(this).parent();
    scheduledEventHour = scheduledEventHour.attr('id');
    var scheduledEventText = $(this).siblings("textarea").val();

    //turns the hour-XX id and the text value in the text area into an object.
    var newScheduledEvents = {
      hour: scheduledEventHour,
      text: scheduledEventText,
    };

    //checks to see if the local storage has anything inside, and sets it to a variable if so, sets it to an empty array.
    //then pushes the new event object into the events arry and then saves it to local storage.
    var scheduledEvents = readScheduledEventsFromStorage();
    scheduledEvents.push(newScheduledEvents);
    saveSchedule(scheduledEvents);
  }



  // Code to get any user input that was saved in localStorage and set
  // the values to the corresponding textarea elements.
  function setScheduledEvents(){
    var scheduledEvents = readScheduledEventsFromStorage();

    for (var i = 0; i < scheduledEvents.length; i++){
      var scheduledEvent = scheduledEvents[i];
      var scheduledEventText = scheduledEvent.text;
      var scheduledEventHour = scheduledEvent.hour;
      var timeBlock = $('#' + scheduledEventHour);
      console.log(timeBlock);
      timeBlock = timeBlock.children("textarea");
      console.log(timeBlock);
      timeBlock.text(scheduledEventText);
    } 
  }

  //runs the startup function to build the page, and set events from local storage.
  startup();

  //listener for click events on the save button. runs the save events function when they click the save button.
  scheduleContainerEl.on('click', '.saveBtn', saveEvents);
});
