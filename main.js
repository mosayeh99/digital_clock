let days = document.querySelectorAll('.clock .days span');
let hours = document.querySelector('.watch .hour');
let minute = document.querySelector('.watch .minute');
let second = document.querySelector('.watch .second');
let timestats =document.querySelector('.icons span');
let alarmIcons = document.querySelectorAll('.icons img');

let nowDate;
setInterval(() => {
    nowDate = new Date();
    let dd = nowDate.getDay();
    let hh = nowDate.getHours();
    let mm = nowDate.getMinutes();
    let ss = nowDate.getSeconds();
    // -------------Get Day Name------------------------
    days.forEach((e) => {
        e.classList.remove('active')
        if (e.dataset.day == dd) {
            e.classList.add('active');
        }
    });
    // -------------Hours & Minutes & Seconds------------
    if (hh > 12 && hh < 24) {
        let hh12 = hh - 12;
        hours.textContent = `${hh12 < 10 ? '0' + hh12 : hh12}:`;
        timestats.textContent = 'PM';
    } else if (hh == 0) {
        hours.textContent = '12:';
        timestats.textContent = 'AM';
    } else {
        hours.textContent = `${hh < 10 ? '0' + hh : hh}:`;
        timestats.textContent = 'AM';
    }
    minute.textContent = `${mm < 10 ? '0' + mm : mm}:`;
    second.textContent = ss < 10 ? '0' + ss : ss;
}, 1000);

// --------------Alarm PopUp-------------------
let addAlarmBtn = document.querySelector('.alarm .add-alarm button');
let popup = document.querySelector('.popup');
let popupCloseBtn = document.querySelector('.popup .popup-close');
let alarmHours = document.querySelector('.add-time .hours input');
let alarmMinutes = document.querySelector('.add-time .minutes input');
let alarmSeconds = document.querySelector('.add-time .seconds input');
let setAlarm = document.querySelector('.box button');
let alarmsDiv = document.querySelector('.all-alarm-in');

addAlarmBtn.onclick = () => {
    popup.style.display = 'flex';
    autoFocusAlarmInputs()
}

function autoFocusAlarmInputs() {
    alarmHours.focus();
    alarmHours.onkeyup = () => {
        if (alarmHours.value.length == 2) {
            alarmMinutes.focus();
        }
    }
    alarmMinutes.onkeyup = () => {
        if (alarmMinutes.value.length == 2) {
            alarmSeconds.focus();
        }
    }
}

popupCloseBtn.onclick = () => {
    popup.style.display = 'none';
}

// ---------------------Alarm Countdown Events--------------------
let alarmArray;
if (localStorage.AlarmEvents != null) {
    alarmArray = JSON.parse(localStorage.getItem('AlarmEvents'));
} else {
    alarmArray = [];
}
// localStorage.clear();
setAlarm.onclick = () => {
    if (alarmHours.value != "" || alarmMinutes.value != "" || alarmSeconds.value != "" ) {
        let alarmHH = alarmHours.value == "" ? 0 : +alarmHours.value;
        let alarmMM = alarmMinutes.value == "" ? 0 : +alarmMinutes.value;
        let alarmSS = alarmSeconds.value == "" ? 0 : +alarmSeconds.value;
        let alarmTime = (alarmHH*1000*60*60)+(alarmMM*1000*60)+(alarmSS*1000);
        let currentTime = nowDate.getTime();
        let eventTime = alarmTime + currentTime;
        alarmArray.push(eventTime);
        localStorage.setItem('AlarmEvents', JSON.stringify(alarmArray));
        alarmHours.value = "";
        alarmMinutes.value = "";
        alarmSeconds.value = "";
        popup.style.display = 'none';
        alarmIcon();
    }
}

getAlarms();
function getAlarms() {
    setInterval(() => {
        let count = 0;
        let table = "";
        alarmArray.forEach((e) => {
            count++;
            let diffTime = e - nowDate;
            let alarmInHH = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let alarmInMM = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            let alarmInSS = Math.floor((diffTime % (1000 * 60)) / 1000);
            if (diffTime < 0) {
                table += `
                <div class="alarm-in">
                    <p>Alarm is Ended!</p>
                    <p class="alarm-del" data-index="${count - 1}">+</p>
                </div>
            `
            } else {
                table += `
                <div class="alarm-in">
                    <p>Alarm in <span>${alarmInHH}</span> hours, <span>${alarmInMM}</span> minutes and <span>${alarmInSS}</span> seconds</p>
                    <p class="alarm-del" data-index="${count - 1}">+</p>
                </div>
            `
            }
        })
        alarmsDiv.innerHTML = table;
    }, 1000);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('alarm-del')) {
        alarmArray.splice(+e.target.dataset.index, 1);
        localStorage.setItem('AlarmEvents', JSON.stringify(alarmArray));
        getAlarms();
        alarmIcon();
    }
});

// ------------Show Alarm Icon when alarms array not empty--------------
alarmIcon();
function alarmIcon() {
    if (alarmArray.length != 0) {
        alarmIcons.forEach((e) => {
            e.classList.remove('active');
            if (e.classList.contains('alarm-bell')) {
                e.classList.add('active');
            }
        })
    }else {
        alarmIcons.forEach((e) => {
            e.classList.remove('active');
            if (e.classList.contains('alarm-normal')) {
                e.classList.add('active');
            }
        })
    }
}