//in mobile simulator - oninput fires as soon as the date is clicked, thus set a first click var to check if it's a first click
var firstClick = true;
//the following prevents form from resubmitting
// if ( window.history.replaceState ) {
//   window.history.replaceState( null, null, window.location.href );
// }

//if there is a message, such as successful entry, clear it after 1 second
(function clearMessage() {
  let message = document.getElementById("message");
  if (message){
    setTimeout(() => {
      message.style.opacity = "0";
    }, 1000);
    setTimeout(() => {
      message.style.zIndex = "-1";
    }, 2001);
  }
})();

//change the class name of a sent element from old to new
function changeClass(elt, oldClassNm, newClassNm) {
  elt.classList.remove(oldClassNm);
  elt.classList.add(newClassNm);
}

//find and return the host part of the url - if there is no history, return the full string, otherwise return the portion preceeding history
function urlRoot() {
  return window.location.href.search("history")===-1?window.location.href:window.location.href.slice(0, window.location.href.search("history"));
}

function displaySettings() {
  const settingsMenu = document.getElementById("settingsMenu");
  settingsMenu.style.opacity = "1";
  settingsMenu.style.height = "2em";

}

//response to toggle display buttons: hide/unhide workout/fuel sections
function sectDisplay (caller) {

  //for future
  //chart elements have inline styling, thus, instead of using "hidden" class, to not display chart section, height and opacity are used

  const classPrefix = caller.classList.contains("fuelDisplayBtn")||caller.classList.contains("fuelHideBtn")?"fuel":"workout";
  

  if (caller.classList.contains(classPrefix+"DisplayBtn")) {
    caller.classList.replace(classPrefix+"DisplayBtn", classPrefix+"HideBtn");

    Array.from(document.getElementsByClassName(classPrefix+"Entry")).forEach(x=>x.classList.add("hidden"));

  } else {
    caller.classList.replace(classPrefix+"HideBtn", classPrefix+"DisplayBtn");

    Array.from(document.getElementsByClassName(classPrefix+"Entry")).forEach(x=>x.classList.remove("hidden"));
  }
}

//subsection of fields for multiple entries on a single day - a click on "more" subsections button
function moreEntries(tgt) {
  //clone the subentry (workoutSubEntry), appending it after the current one
  const newDiv = tgt.parentElement.parentElement.cloneNode(true);
  tgt.parentElement.parentElement.after(newDiv);
  //display the less button
  newDiv.getElementsByClassName("more")[1].classList.remove("hidden");
}

//a click on "less" subsections button
function lessEntries(tgt) {
  tgt.parentElement.parentElement.parentElement.removeChild(tgt.parentElement.parentElement);
}

//go back to the new entry screen - could change this to a link instead of a button
function btnBackClk() {
  window.location.replace(urlRoot());
}

//enable field editing for historical entry
function btnEditClk(tgt) {

  //if "edit ✏️" is clicked, the editing input fields and their labels need to get class visible, otherwise, if "cancel ⨉" is clicked, give them class hidden
  if (tgt.innerText === "✏️") {
  
    //animated increase in labels opacity via adding lblVisible class
    Array.from(tgt.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("histLook")).forEach(x => x.classList.add("lblVisible"));

    //remove all except "less entrries" hidden classes from the selected entry form, thus unhiding input entryDate, buttons put and delete, possibly fuel section; the "less entries" "more hidden" button needs to stay hidden for the first subentry; no animation; 
    Array.from(tgt.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("hidden")).forEach(x => {
      if(x.innerText!="-☝") x.classList.replace("hidden", "unhidden");
    });
    
    //hide the date field used for pretty display, replacing it with the input field with usable, properly formatted date (handled above); no animation;
    tgt.parentElement.parentElement.getElementsByClassName("displayDate")[0].classList.add("hidden");
    //also hide entry toggle buttons
    Array.from(tgt.parentElement.parentElement.getElementsByClassName("toggleBtn")).forEach(x => x.classList.add("hidden"));

    //make input fields editable and of appropriate format by removing histElt class, whose history viewing looks are set in css
    Array.from(tgt.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("histElt")).forEach(x => {
      x.removeAttribute("readonly");
      x.classList.remove("histElt");
      //add the editing... class so that elements can be located for canceling
      x.classList.add("editingHistElt");

      let nm = x.getAttribute("name");
      if (nm === "entryDate") {
        x.type = "date";
      } else if (["weight", "sets", "reps", "sleepHours"].includes(nm)) {
        x.type = "number";
        x.step = "0.1";
      } 
    });
    tgt.innerText = "⨉";
  } else {
    //animated decrease in labels opacity
    Array.from(tgt.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("histLook")).forEach(x => x.classList.remove("lblVisible"));

    //hide unhidden input entryDate, buttons put and delete; no animation;
    Array.from(tgt.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("unhidden")).forEach(x => {
      x.classList.add("hidden");
      x.classList.remove("unhidden");
    });

    //unhide the date field used for pretty display
    tgt.parentElement.parentElement.getElementsByClassName("displayDate")[0].classList.remove("hidden");
    //also unhide entry toggle buttons
    Array.from(tgt.parentElement.parentElement.getElementsByClassName("toggleBtn")).forEach(x => x.classList.remove("hidden"));

    //make input fields ineditable and of appropriate format; not animated;
    Array.from(tgt.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("editingHistElt")).forEach(x => {
      x.readOnly = true;
      x.removeAttribute("type");
      x.classList.add("histElt");
      x.classList.remove("editingHistElt");
      let nm = x.getAttribute("name");
    });
    tgt.innerText = "✏️";
  }

}

function displayAlertWithText(txt) {
    // animated opacity appearance instead of using display via hidden class
    const alertMsgBox = document.getElementById("alertMsg");
    alertMsgBox.children[0].innerText = txt;
    alertMsgBox.style.opacity = "1";
    alertMsgBox.style.zIndex = "3";
    // document.getElementById("alertMsg").classList.remove("hidden");
}

function closeAlert(tgt) {
  document.getElementsByName("entryDate")[0].value="";
  const alertMsgBox = document.getElementById("alertMsg");
  alertMsgBox.style.opacity = "0";
  alertMsgBox.style.zIndex = "-1";
}
//when a new entry is made, ensure there isn't already an entry for that date
function checkDateUniqueness(tgt) {
  const dateKeeperField = document.getElementById("recordedDates").value.replace(/ entryDate: |{| }/g,"").split(",").map(x=>x.slice(0,10));
  
  if(dateKeeperField.includes(tgt.value)){
    displayAlertWithText("There is already an entry for this date, would you like to view, edit or delete it?");
  }
}

//the following function runs if a user tries to enter a date that already has been recorded and chooses to view that in history
function triggerHistory() {
  firstClick = false;
  const entryDateValue = document.getElementsByName("entryDate")[0].value;
  const histDateField = document.getElementById("dateFrom");
  histDateField.value = entryDateValue;
  pullHistory(histDateField);
}

//! depending on a call and parameters, display/hide new or historical elements and adjust their styling accordingly via adding/removing a class
function pullHistory(tgt) {

  //mobile - don't do anything on first click
  if (window.matchMedia("only screen and (max-width: 900px)").matches){
    if (firstClick) {
      firstClick = false;
      return;
    }
  }
  
  if (tgt.id === "dateFrom") {
    window.location.replace(`${urlRoot()}history?dateFrom=${tgt.value}`);
  } else {
    window.location.replace(`${urlRoot()}history?dateFrom=${document.getElementById("dateFrom").value}&dateTo=${tgt.value}`);
  }
}

//emoji buttons allow quick muscle and activity entry; on click of the first one, that's next to date, display others;
//todo: populate other buttons with the top 4/5 most used, based on user's entries; save user's last preference (hidden or shown emojis)
function showEmojis(tgt) {
  if (tgt.style.filter === "grayscale(0)") {
    tgt.style.filter = "grayscale(1)";
    document.getElementById("emojRow").classList.add("hidden")
  } else {
    tgt.style.filter = "grayscale(0)";
    document.getElementById("emojRow").classList.remove("hidden")
  };
}

//quick muscle and activity entry via emoji buttons
function emojResponse(tgt) {
  
  //the input fields' value, used to white out the fields when an emoji is disselected
  let inputVal = null;

  //toggle the grayness of emoji shortcuts
  if (tgt.style.filter === "grayscale(0)") {
    tgt.style.filter = "grayscale(1)";
    inputVal = " ";
  } else {
    //when removing gray filter, gray-out other buttons
    Array.from(tgt.parentElement.children).forEach( x => {
      x.style.filter = "grayscale(1)";
    })
    tgt.style.filter = "grayscale(0)";
    inputVal = null;
  }

  switch (tgt.innerText) {
    case "💪":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[0].value = inputVal || "Bicepts";
      break;
    case "🦵":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[0].value = inputVal || "Legs";
      break;
    case "🫀":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[0].value = inputVal || "Heart";
      break;
    case "🧠":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[0].value = inputVal || "Brain";
      break;
    case "🏊‍♂️":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[1].value = inputVal || "Swimming";
      break;
    case "🏋️‍♀️":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[1].value = inputVal || "Bench";
      break;
    case "🤼":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[1].value = inputVal || "Wrestling";
      break;
    case "🏈":
      tgt.parentElement.parentElement.parentElement.getElementsByTagName("input")[1].value = inputVal || "Football";
      break;
  }
}

//graph historical data - not done yet
function graphIt() {

  document.getElementById("chart").style.display = "block";

  var xyValues = [
    {x:5, y:7},
    {x:6, y:8},
    {x:7, y:8},
    {x:8, y:9},
    {x:9, y:9},
    {x:10, y:9},
    {x:11, y:10},
    {x:12, y:0},
    {x:13, y:14},
    {x:14, y:14},
    {x:15, y:15}
  ];
  
  new Chart("myChart", {
    type: "line",
    data: {
      datasets: [{
        pointRadius: 2,
        pointBackgroundColor: "rgb(,,255)",
        data: xyValues
      }]
    },
    options: {
      legend: {display: false},
      scales: {
        xAxes: [{ticks: {min: 4, max:160}}],
        yAxes: [{ticks: {min: 6, max:16}}],
      }
    }
  });
}

//a self-calling function, just in case
// (function () {
// })();