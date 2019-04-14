'use strict';


var calendar = document.getElementById("calendar-table");
var gridTable = document.getElementById("table-body");
const popup = document.querySelector('.calendar-footer');
var currentDate = new Date();
var selectedDate = currentDate;
var selectedDayBlock = null;
var globalEventObj = {};


var sidebar = document.getElementById("sidebar");

function createCalendar(date, side) {
    var currentDate = date;
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    var monthTitle = document.getElementById("month-name");
    var monthName = currentDate.toLocaleString("ru-RU", {
        month: "long"
    });
    
    
    var yearNum = currentDate.toLocaleString("ru-RU", {
        year: "numeric"
    });
    monthTitle.innerHTML = `${monthName} ${yearNum}`;

    if (side == "left") {
        gridTable.className = "animated fadeOutRight";
    } else {
        gridTable.className = "animated fadeOutLeft";
    }

    gridTable.innerHTML = "";

    var newTr = document.createElement("div");
    newTr.className = "row";
    var currentTr = gridTable.appendChild(newTr);

    // new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), 0).getDate();
    const prevDays = new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    //prev last month?????????????????????????
    for (let i = 1; i < startDate.getDay(); i++) {
        let emptyDivCol = document.createElement("div");
        emptyDivCol.className = "col empty-day";


        var number = (prevDays - firstDay) + (i + 1);
        // console.log(number);
        // console.log(emptyDivCol);

        emptyDivCol.innerHTML = number;
        currentTr.appendChild(emptyDivCol);
    }//prev last month?????????????????????????



    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);


    lastDay = lastDay.getDate();

    for (let i = 1; i <= lastDay; i++) {
        if (currentTr.getElementsByTagName("div").length >= 7) {
            currentTr = gridTable.appendChild(addNewRow());
        }
        let currentDay = document.createElement("div");
        currentDay.className = "col";

        let currentDateNum = document.createElement("div");
        currentDateNum.className = "date";

        let currentEvent = document.createElement("div");
        currentEvent.className = "event";

        currentDay.appendChild(currentDateNum);
        currentDay.appendChild(currentEvent);

        if (selectedDayBlock == null && i == currentDate.getDate() || selectedDate.toDateString() == new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()) {
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

            // document.getElementById("eventDayName").innerHTML = selectedDate.toLocaleString("ru-RU", {
            //     month: "long",
            //     day: "numeric",
            //     year: "numeric"
            // });

            selectedDayBlock = currentDay;
            setTimeout(() => {
                currentDay.classList.add("blue");
                currentDay.classList.add("lighten-3");
            }, 900);
        }
        currentDateNum.innerHTML = i;
        currentTr.appendChild(currentDay);
    }



    //last day -----------------------------------------
    for (let i = currentTr.getElementsByTagName("div").length; i < 7; i++) {
        let emptyDivCol = document.createElement("div");
        const notEmptyDivCol = currentTr.querySelectorAll('.col:not(.empty-day)').length;
        emptyDivCol.className = "col empty-day";
        const number = (currentTr.getElementsByTagName("div").length - notEmptyDivCol) + 1;
        emptyDivCol.innerHTML = number;
        currentTr.appendChild(emptyDivCol);

    }//last day -----------------------------------------

    setTimeout(() => {
        if (side == "left") {
            gridTable.className = "animated fadeInLeft";
        } else {
            gridTable.className = "animated fadeInRight";
        }
    }, 270);

    function addNewRow() {
        let node = document.createElement("div");
        node.className = "row";
        return node;
    }
}

createCalendar(currentDate);

var todayDayName = document.getElementById("todayDayName");
todayDayName.innerHTML = "Сегодня " + currentDate.toLocaleString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "short"
});

var prevButton = document.getElementById("prev");
var nextButton = document.getElementById("next");


prevButton.onclick = changeMonthPrev;
nextButton.onclick = changeMonthNext;




function changeMonthPrev(e) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    createCalendar(currentDate, "left");
}
function changeMonthNext(e) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    createCalendar(currentDate, "right");
}

function addEvent(title, desc) {
    if (!globalEventObj[selectedDate.toDateString()]) {
        globalEventObj[selectedDate.toDateString()] = {};
    }
    globalEventObj[selectedDate.toDateString()][title] = desc;
}

function showEvents(el = selectedDayBlock) {
    // let sidebarEvents = document.getElementById("sidebarEvents");
    let sidebarEvents = el.querySelector('.event');
    let objWithDate = globalEventObj[selectedDate.toDateString()];

    // sidebarEvents.innerHTML = "";

    if (objWithDate) {
        let eventsCount = 0;
        
        for (let key in globalEventObj[selectedDate.toDateString()]) {
            let eventContainer = document.createElement("div");
            let eventHeader = document.createElement("div");
            eventHeader.className = "eventCard-header";

            let eventDescription = document.createElement("div");
            eventDescription.className = "eventCard-description";

            eventHeader.appendChild(document.createTextNode(key));
            eventContainer.appendChild(eventHeader);

            eventDescription.appendChild(document.createTextNode(objWithDate[key]));
            eventContainer.appendChild(eventDescription);

            let markWrapper = document.createElement("div");
            markWrapper.className = "eventCard-mark-wrapper";
            let mark = document.createElement("div");
            mark.classList = "eventCard-mark";
            markWrapper.appendChild(mark);
            eventContainer.appendChild(markWrapper);

            eventContainer.className = "eventCard";

            sidebarEvents.appendChild(eventContainer);

            eventsCount++;
        }
        let emptyFormMessage = document.getElementById("emptyFormTitle");
        emptyFormMessage.innerHTML = `${eventsCount} events now`;
    } else {
        // let emptyMessage = document.createElement("div");
        // emptyMessage.className = "empty-message";
        // emptyMessage.innerHTML = "Sorry, no events to selected date";
        // sidebarEvents.appendChild(emptyMessage);
        // let emptyFormMessage = document.getElementById("emptyFormTitle");
        // emptyFormMessage.innerHTML = "No events now";
        return;
    }
}





gridTable.onclick = function (e) {
    let target = e.target;
    
    
    while (target != this) {
        
        if (target.classList.contains('col')) {
            if (selectedDayBlock) {
                if (selectedDayBlock.classList.contains("blue") && selectedDayBlock.classList.contains("lighten-3")) {
                    selectedDayBlock.classList.remove("blue");
                    selectedDayBlock.classList.remove("lighten-3");
                }
            }
            selectedDayBlock = target;
            selectedDayBlock.classList.add("blue");
            selectedDayBlock.classList.add("lighten-3");

            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(e.target.innerHTML));
            
            
            let eventTitle = target.querySelector('.eventCard-header');
            let eventDescr = target.querySelector('.eventCard-description');

            
            document.getElementById("eventTitleInput").value = "";
            document.getElementById("eventDescInput").value = "";
               
            
            if(eventTitle) {
                let eventTitleValue = eventTitle.textContent;
                document.getElementById("eventTitleInput").value = eventTitleValue;
                
                // globalTitleVal = eventTitleValue;
            } 
    
            if (eventDescr) {
                let eventDescrValue = eventDescr.textContent;
                document.getElementById("eventDescInput").value = eventDescrValue;
                // globalDescrVal = eventDescrValue
            }
            
            
            showEvents(selectedDayBlock);

            document.getElementById("eventDayName").innerHTML = selectedDate.toLocaleString("ru-RU", {
                month: "long",
                day: "numeric",
                year: "numeric"
            });

            popup.classList.add('active');
        

            // return;
            break;
        }
        
        target = target.parentNode;
    }

    // console.log(selectedDayBlock)
    // if (!e.target.classList.contains("col") || e.target.classList.contains("empty-day")) {
    //     return;
    // }
    
    

}

var changeFormButton = document.getElementById("changeFormButton");
var addForm = document.getElementById("addForm");
changeFormButton.onclick = function (e) {
    addForm.style.top = 0;
}

var cancelAdd = document.getElementById("cancelAdd");
cancelAdd.onclick = function (e) {
    addForm.style.top = "100%";
    let inputs = addForm.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    let labels = addForm.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
        labels[i].className = "";
    }
}

var addEventButton = document.getElementById("addEventButton");
addEventButton.onclick = function (e) {
    let title = document.getElementById("eventTitleInput").value.trim();
    let desc = document.getElementById("eventDescInput").value.trim();

    if (!title || !desc) {
        document.getElementById("eventTitleInput").value = "";
        document.getElementById("eventDescInput").value = "";
        let labels = addForm.getElementsByTagName("label");
        for (let i = 0; i < labels.length; i++) {
            labels[i].className = "";
        }
        return;
    }

    addEvent(title, desc);
    
    showEvents(selectedDayBlock);

    if (!selectedDayBlock.querySelector(".day-mark")) {
        selectedDayBlock.appendChild(document.createElement("div")).className = "day-mark";
    }

    let inputs = addForm.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    let labels = addForm.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
        labels[i].className = "";
    }

    popup.classList.remove('active');

}


    
function createTip(ev) {
    var title = this.title;
    this.title = '';
    this.setAttribute("tooltip", title);




    var tooltipWrap = document.createElement("div"); //creates div
    tooltipWrap.className = 'tooltip'; //adds class
    tooltipWrap.appendChild(document.createTextNode(title)); //add the text node to the newly created div.

    var firstChild = document.body.firstChild;//gets the first elem after body
    firstChild.parentNode.insertBefore(tooltipWrap, firstChild); //adds tt before elem

    var padding = 5;
    var linkProps = this.getBoundingClientRect();
    var tooltipProps = tooltipWrap.getBoundingClientRect();




    // console.log(tooltipProps.height);

    var topPos = linkProps.top - (tooltipProps.height + padding);


    tooltipWrap.setAttribute('style', 'top:' + topPos + 'px;' + 'left:' + linkProps.left + 'px;')
    // tooltipWrap.setAttribute('style','left:'+linkProps.left+'px;')

}
function cancelTip(ev) {
    var title = this.getAttribute("tooltip");
    this.title = title;
    this.removeAttribute("tooltip");
    document.querySelector(".tooltip").remove();
}



var links = document.links;
for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (a.title !== '') {
        a.addEventListener('mouseover', createTip);
        a.addEventListener('mouseout', cancelTip);
    }
}





