//change the class name of a sent element from old to new
function changeClass(elt, oldClassNm, newClassNm) {
  elt.classList.remove(oldClassNm);
  elt.classList.add(newClassNm);
}

//response to a roll up / roll down: add/remove class hidden to all except 1st  children of the clicked button's parent element-section; the clicked button is the only remaining visible element, thus the height of the parent section is reduced to min-height set in style, 2em;
function displaySection (caller) {

  //not done yet
  //chart elements have inline styling, thus, instead of using my "hidden" class, to minimize chart section, I have to set its height and opacity
  // if (caller.innerText==="-") {
  //   caller.parentElement.style.height = "2.5em";
  //   Array.from(caller.parentElement.children).forEach(x => 
  //     x.classList.contains("roll")?
  //     x.innerText = "+":
  //     x.style.opacity="0");
  //     return;
  // } else {
  //   caller.parentElement.style.height = "182px";
  //   Array.from(caller.parentElement.children).forEach(x => 
  //     x.classList.contains("roll")?
  //     x.innerText = "-":
  //     x.style.opacity = "1");
  //     graphIt();
  //     return;
  // }  

  if (caller.innerText==="-") {
    Array.from(caller.parentElement.children).forEach(x => 
      x.classList.contains("roll")?
      x.innerText = "+":
      x.classList.add("hidden"));
  } else {
    Array.from(caller.parentElement.children).forEach(x => 
      x.classList.contains("roll")?
      x.innerText = "-":
      x.classList.remove("hidden"));
  }
}

//toggle display
function setDisplayType(elt, displayType) {
  if (!displayType) {
    displayType = window.getComputedStyle(elt).display!="none"?"none":"block";
  }
  elt.style.display = displayType;

  //possible future animation
  // elt.classList.add("visibleElt");
}

//subsection of fields for multiple entries on a single day
function moreEntries(tgt) {
  //if this is the first click on the "more" button, display the less button and shift more button to the left
  const btnLess = document.getElementsByClassName("more")[1];
  if (btnLess.classList.contains("hidden")) {
    btnLess.classList.remove("hidden");
    tgt.style.right = "20vw";
  }
  //find the subentry ane clone it, appending after the 1st one
  const subEntry = document.getElementsByClassName("workoutSubEntry")[0];
  const newDiv = subEntry.cloneNode(true);
  subEntry.after(newDiv);
}

//click on "less" subsections button
function lessEntries(tgt) {
  const subEntries = document.getElementsByClassName("workoutSubEntry");
  // if there is only one subsection, remove it and hide the "less" button, otherwise just remove a subsection 
  if (subEntries.length === 2) {
    tgt.classList.add("hidden");
    document.getElementsByClassName("more")[0].style.right = "2vw";
  }
  subEntries[0].parentElement.removeChild(subEntries[subEntries.length-1]);
}

//when a new entry is made, ensure there isn't already an entry for that date
function checkDateUniqueness(tgt) {
  const dateKeeperField = document.getElementById("recordedDates").value.replace(/ entryDate: |{| }/g,"").split(",").map(x=>x.slice(0,10));
  console.log(dateKeeperField);
  
  if(dateKeeperField.includes(tgt.value)){
    // animated opacity appearance instead of using display via hidden class
    const alertMsgBox = document.getElementById("alertMsg");
    alertMsgBox.style.opacity = "1";
    alertMsgBox.style.zIndex = 3;
    // document.getElementById("alertMsg").classList.remove("hidden");
  }
}

//todo: needs work
// function deleteEntry(tgt) {

//   console.log("delete an entry");

//   window.location.replace(`http://localhost:3002/history/delete?_id=${tgt.parentElement.getElementsByClassName("deleteID")[0].value}`);

//   window.location.replace(`http://localhost:3002/history?dateFrom=${tgt.value}`);
// }

//go back to the new entry screen
function btnBackClk() {
  window.location.replace("http://localhost:3002/");
}

//show fields for editing historical entry
function btnEditClk(tgt) {

  //animated increase in labels height and opacity
  Array.from(document.getElementsByClassName("histLook")).forEach(x => x.classList.add("lblVisible"));

  //remove all hidden classes
  Array.from(document.getElementsByClassName("hidden")).forEach(x => x.classList.remove("hidden"));
  
  //hide the display date fields
  Array.from(document.getElementsByClassName("displayDate")).forEach(x => x.classList.add("hidden"));

  //make input fields editable and of appropriate format
  const histElts = Array.from(document.getElementsByClassName("histElt"));
  histElts.forEach(x => {
    x.removeAttribute("readonly");
    x.classList.remove("histElt");
    let nm = x.getAttribute("name");
    if (nm === "entryDate") {
      x.type = "date";
    } else if (["weight", "sets", "reps", "sleepHours"].includes(nm)) {
      x.value = parseInt(x.value.toString().split(":")[1].trim());
      x.type = "number";
    } else if (["breakfast", "lunch", "dinner"].includes(nm)) {
      x.value = x.value.toString().split(":")[1].trim();
    }
  });

  const btnSave = document.getElementById("btnSave");
  btnSave.innerText = "save";
  btnSave.type = "submit";
  btnSave.removeEventListener("onclick", btnBackClk);
  
  tgt.innerText = "cancel";
  tgt.removeEventListener("click", btnEditClk);
  tgt.addEventListener("click", function(){
    window.location = window.location;
  })

}

//mobile simulator - oninput fires as soon as the date is clicked, thus set a first click var to check if it's a first click
var firstClick = true;

function triggerHistory() {
  firstClick = false;
  const histDate = document.getElementById("dateFrom");
  histDate.value = "2021-10-01";
  pullHistory(histDate)
}
//! depending on a call and parameters, display/hide new or historical elements and adjust their styling accordingly via adding/removing a class
function pullHistory(tgt) {

  //mobile - don't do anything on first click
  if (window.matchMedia("only screen and (max-width: 375px)").matches){
    if (firstClick) {
      firstClick = false;
      return;
    }
  }

  if (tgt.id === "dateFrom") {
    window.location.replace(`http://localhost:3002/history?dateFrom=${tgt.value}`);
  } else {
    window.location.replace(`http://localhost:3002/history?dateFrom=${document.getElementById("dateFrom").value}&dateTo=${tgt.value}`);
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