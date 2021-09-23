// function formClick(e) {
  
//   if (e.target.id != "btnClear") e.preventDefault();

//   if (e.target.tgt.className === "rollDn")
//       setDisplayType(tgt)
// }

function changeClass(elt, oldClassNm, newClassNm) {
  elt.classList.remove(oldClassNm);
  elt.classList.add(newClassNm);
}

function displaySection (caller, tgt) {
  console.log(`click on roll down, caller: ${caller}, target: ${tgt}`);

  let params = [];
  if (caller.classList.contains("rollUp")) {
    params = ["rollUp", "rollDn", "2em", "hidden", "0"];
  } else {
    params = ["rollDn", "rollUp", "initial", "initial", "1"];
  }

  changeClass(caller, params[0], params[1]);
  document.getElementById(tgt).style.height = params[2];
  document.getElementById(tgt).style.overflowY = params[3];
  document.getElementById(tgt).style.opacity = params[4];
}

function setDisplayType(elt, displayType) {
// function setDisplayType(eltId, displayType) {
  // elt = document.getElementById(eltId);
  
  if (!displayType) {
    displayType = window.getComputedStyle(elt).display!="none"?"none":"block";
  }
  elt.style.display = displayType;

  //possible future animation
  // elt.classList.add("visibleElt");
}

//! depending on a call and parameters, display/hide new or historical elements and adjust their styling accordingly via adding/removing a class
function pullDayHistory(e) {

  //for elements with class histElt, replace the histElt class with histLook class that has the compressed look for displaying historical data
  const histElts = Array.from(document.getElementsByClassName("histElt"));
  histElts.forEach(x => x.classList.remove("histElt"));
  histElts.forEach(x => x.classList.add("histLook"));
  //compress the top margin from 1em to 0.5em for row labels
  // Array.from(document.getElementsByClassName("lblRow")).forEach(x => x.style.marginTop = "0.5em");

  //hide elements that support new data entry
  Array.from(document.getElementsByClassName("newElt")).forEach(x => x.style.display = "none");

  const newEntrySection = document.getElementById("workoutEntry");
  const foodSleepSection = document.getElementById("foodSleepEntry");

  //OUTPUT: HISTORY DATA
  newEntrySection.children[2].children[0].innerText = "shoulders";
  newEntrySection.children[2].children[1].innerText = "bench press";
  newEntrySection.children[4].children[0].innerText = "weight: 100lbs;";
  newEntrySection.children[4].children[1].innerText = "\t\xa0\tsets: 5;";
  newEntrySection.children[4].children[2].innerText = "reps: 8;";
  newEntrySection.children[6].innerText = "comments: ";

  foodSleepSection.children[0].innerText = "hours slept: 10";
  foodSleepSection.children[2].children[0].innerText = "breakfast:\xa0\n";
  foodSleepSection.children[2].children[1].innerText = "lunch:\xa0\n";
  foodSleepSection.children[2].children[2].innerText = "dinner:\xa0";

  document.getElementById("btnSave").innerText = "edit";
}

function pullRangeHistory() {
  graphIt();
}

//graph historical data
function graphIt() {

  //if both, date from and to are empty, exit

  ["chart", "chartDisplay"].forEach(x=>setDisplayType(document.getElementById(x), "block"));
  // ["chart", "chartDisplay"].forEach(x=>setDisplayType(x, "block"));

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
        pointRadius: 4,
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


function saveEntry() {

}