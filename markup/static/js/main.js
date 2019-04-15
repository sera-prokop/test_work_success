'use strict';

const calendar = document.getElementById("calendar-table");
const gridTable = document.getElementById("table-body");
const popup = document.querySelector('.calendar-footer');
let currentDate = new Date();
let selectedDate = currentDate;
let selectedDayBlock = null;
let globalEventObj = {};
let coordLeftSelectBlock;


function createCalendar(date, side) {
    let currentDate = date;
    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const monthTitle = document.getElementById("month-name");
    let monthName = currentDate.toLocaleString("ru-RU", {
        month: "long"
    });

    let yearNum = currentDate.toLocaleString("ru-RU", {
        year: "numeric"
    });
    monthTitle.innerHTML = `${monthName} ${yearNum}`;

    if (side == "left") {
        gridTable.className = "animated fadeOutRight";
    } else {
        gridTable.className = "animated fadeOutLeft";
    }

    gridTable.innerHTML = "";

    let newTr = document.createElement("div");
    newTr.className = "row";
    let currentTr = gridTable.appendChild(newTr);

    const prevDays = new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // prev day
    for (let i = 1; i < startDate.getDay(); i++) {
        let emptyDivCol = document.createElement("div");
        emptyDivCol.className = "col empty-day";

        let number = (prevDays - firstDay) + (i + 1);

        let currentDateNum = document.createElement("div");
        currentDateNum.className = "date";
        currentDateNum.innerHTML = number;

        emptyDivCol.appendChild(currentDateNum);
        currentTr.appendChild(emptyDivCol);
    }



    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);


    lastDay = lastDay.getDate();


    for (let i = 1; i <= lastDay; i++) {
        if (currentTr.getElementsByClassName("col").length >= 7) {
            currentTr = gridTable.appendChild(addNewRow());
        }
        let currentDay = document.createElement("div");
        currentDay.className = "col";

        let currentDateNum = document.createElement("div");
        currentDateNum.className = "date";
        currentDateNum.innerHTML = i;

        let currentEvent = document.createElement("div");
        currentEvent.className = "event";

        currentDay.appendChild(currentDateNum);
        currentDay.appendChild(currentEvent);

        if (selectedDayBlock == null && i == currentDate.getDate() || selectedDate.toDateString() == new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString()) {
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);


            selectedDayBlock = currentDay;
            setTimeout(() => {
                currentDay.classList.add("blue");
                currentDay.classList.add("lighten-3");
            }, 900);
        }

        currentTr.appendChild(currentDay);
    }

    // next day
    for (let i = currentTr.getElementsByClassName("col").length; i < 7; i++) {
        let emptyDivCol = document.createElement("div");
        const notEmptyDivCol = currentTr.querySelectorAll('.col:not(.empty-day)').length;
        emptyDivCol.className = "col empty-day";
        const number = (currentTr.getElementsByClassName("col").length - notEmptyDivCol) + 1;
        emptyDivCol.innerHTML = number;
        currentTr.appendChild(emptyDivCol);

    }

    setTimeout(() => {
        if (side == "left") {
            gridTable.className = "animated fadeInLeft";
        } else {
            gridTable.className = "animated fadeInRight";
        }
    }, 270);


    const firstRow = gridTable.querySelector('.row:first-child');
    const firstCol = firstRow.querySelectorAll('.col');
    const weekArr = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

    firstCol.forEach(function (el, i) {
        const dateEl = el.querySelector('.date');
        let currentWeek = document.createElement("div");
        if(i === 3){
            coordLeftSelectBlock = getCoords(el).left;
        }
        currentWeek.className = "week";
        currentWeek.innerHTML = weekArr[i];

        el.insertBefore(currentWeek, dateEl)
    });






    function addNewRow() {
        let node = document.createElement("div");
        node.className = "row";
        return node;
    }
}

createCalendar(currentDate);


const todayDayName = document.getElementById("today-day-name");

todayDayName.innerHTML = "Сегодня " + currentDate.toLocaleString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "short"
});


const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");


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


/*
function storageEvents() {
    let localCalendar = localStorage.getItem("myCalendar");
    if(!localStorage.getItem("myCalendar")){
    }else{
        globalEventObj = JSON.parse(localCalendar);


        // Object.entries(globalEventObj).forEach(
        //   ([key, value]) => console.log(key, value)
        // );


        for (let key2 in globalEventObj) {

            for(let key in globalEventObj[key2]){
                if (globalEventObj.hasOwnProperty(key)) {
                    console.log(key + " -> " + globalEventObj[key]);
                }
                console.log(key2);
                let eventContainer = document.createElement("div");
                let eventHeader = document.createElement("div");
                eventHeader.className = "eventCard-header";

                let eventDescription = document.createElement("div");
                eventDescription.className = "eventCard-description";

                eventHeader.appendChild(document.createTextNode(key));
                eventContainer.appendChild(eventHeader);

                eventDescription.appendChild(document.createTextNode(key2));
                eventContainer.appendChild(eventDescription);

                let markWrapper = document.createElement("div");
                markWrapper.className = "eventCard-mark-wrapper";
                let mark = document.createElement("div");
                mark.classList = "eventCard-mark";
                markWrapper.appendChild(mark);

                eventContainer.appendChild(markWrapper);
                eventContainer.className = "eventCard";

                let el = selectedDayBlock;
                let elEvents = el.querySelector('.event');

                let sidebarEventsOld = el.querySelector('.event .eventCard');

                if(sidebarEventsOld){
                    elEvents.replaceChild(eventContainer, sidebarEventsOld);
                }else{
                    elEvents.appendChild(eventContainer);
                }
            }
        }
    }
}

storageEvents();
*/


function showEvents(el = selectedDayBlock) {
    let elEvents = el.querySelector('.event');
    let objWithDate = globalEventObj[selectedDate.toDateString()];

    if (objWithDate) {
        let eventsCount = 0;


        for (let key in globalEventObj[selectedDate.toDateString()]) {
            let eventContainer = document.createElement("div");
            let eventHeader = document.createElement("div");
            eventHeader.className = "event-card-header";

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
            eventContainer.className = "event-card";

            let sidebarEventsOld = el.querySelector('.event .event-card');

            if(sidebarEventsOld){
                elEvents.replaceChild(eventContainer, sidebarEventsOld);
            }else{
                elEvents.appendChild(eventContainer);
            }

            eventsCount++;


        }

    } else {

        return false;
    }
    localStorage.setItem('myCalendar', JSON.stringify(globalEventObj));
}

function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}

gridTable.onclick = function (e) {
    let target = e.target;


    while (target != this) {

        if (target.classList.contains('col')) {
            if (selectedDayBlock) {
                if (selectedDayBlock.classList.contains("blue")) {
                    selectedDayBlock.classList.remove("blue");
                }
            }
            selectedDayBlock = target;

            selectedDayBlock.classList.add("blue");

            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(target.getElementsByClassName('date')[0].innerHTML));


            let eventTitle = target.querySelector('.event-card-header');
            let eventDescr = target.querySelector('.eventCard-description');


            document.getElementById("eventTitleInput").value = "";
            document.getElementById("eventDescInput").value = "";


            if(eventTitle) {
                let eventTitleValue = eventTitle.textContent;
                document.getElementById("eventTitleInput").value = eventTitleValue;
            }

            if (eventDescr) {
                let eventDescrValue = eventDescr.textContent;
                document.getElementById("eventDescInput").value = eventDescrValue;
            }

            popup.classList.add('active');
            let coord = getCoords(target);
            let top = coord.top - 20;
            let left = coord.left + target.offsetWidth + 20 ;

            if(coordLeftSelectBlock + target.offsetWidth + 20 < left){
                left = coord.left - popup.offsetWidth - 20;
                popup.classList.add('right');
            }else if(window.innerWidth < 768){
                popup.classList.remove('right');
                popup.classList.add('bottom');
                top = coord.top + 20 + target.offsetHeight;
                left = coord.left;
            }else{
                popup.classList.remove('right');
                popup.classList.remove('bottom');
            }

            popup.style.top = top + 'px';
            popup.style.left = left + 'px';


            break;
        }

        target = target.parentNode;
    }
};


const popupClose = document.getElementById("close-footer");

popupClose.onclick = e => {
    e.preventDefault();
    popup.classList.remove('active');
};



const addForm = document.getElementById("add-form");
const cancelAdd = document.getElementById("cancelAdd");


cancelAdd.onclick = function (e) {
    e.preventDefault();
    let inputs = addForm.getElementsByClassName("add-field");
    let eventBlock = selectedDayBlock.querySelector('.event-card');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    popup.classList.remove('active');
    if(eventBlock){
        eventBlock.remove();
    }

};


const addEventButton = document.getElementById("addEventButton");

addEventButton.onclick = function (e) {
    let title = document.getElementById("eventTitleInput").value.trim();
    let desc = document.getElementById("eventDescInput").value.trim();

    if (!title || !desc) {
        document.getElementById("eventTitleInput").value = "";
        document.getElementById("eventDescInput").value = "";

        return;
    }

    addEvent(title, desc);

    showEvents(selectedDayBlock);

    let inputs = addForm.getElementsByClassName("add-field");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }

    popup.classList.remove('active');

};
