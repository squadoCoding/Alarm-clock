const hContainer = document.getElementById("hours");
const mContainer = document.getElementById("minuts");
const sContainer = document.getElementById("seconds");

const alarms = [];

const viewBtn = document.getElementById("viewAlarms");
const createBtn = document.getElementById("createAlarm");
const customAlert = document.getElementById("customAlert");

const showCustomAlert = async (paraContent, buttonText, snooze) => {
  customAlert.innerHTML = ``;
  customAlert.innerHTML += `<p>${paraContent}</p>`;
  customAlert.innerHTML += `<button id="customAlertBtn">${buttonText}</button>`;
  const waitingPromise = new Promise((resolve, reject) => {
    customAlert.style.top = "90px";
    if (snooze) {
      customAlert.innerHTML += `<button id="customAlertSnooze">Snooze</button>`;
      document.getElementById("customAlertSnooze").addEventListener("click", () => {
        customAlert.style.top = "-400px";
        resolve(false);
      });
    }
    document.getElementById("customAlertBtn").addEventListener("click", () => {
      customAlert.style.top = "-400px";
      resolve(true);
    });
  });
  return await waitingPromise;
};

let time = new Date();

hContainer.innerText = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
mContainer.innerText = time.getMinutes();
sContainer.innerText = time.getSeconds();
sContainer.innerText += time.getHours() > 12 ? "pm" : "am";

setInterval(() => {
  time = new Date();

  hContainer.innerText = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
  mContainer.innerText = time.getMinutes();
  sContainer.innerText = time.getSeconds();
  sContainer.innerText += time.getHours() > 12 ? "pm" : "am";
}, 1000);

let alertUp = false;
setInterval(() => {
  if (!alertUp) {
    alarms.forEach(async (alarm, index) => {
      if (alarm.timeMinutes == time.getMinutes() && alarm.timeHours == time.getHours()) {
        let dismissOrSnooze = showCustomAlert(alarm.title, "Dismiss", true);
        alertUp = true;
        console.log(dismissOrSnooze);
        if (dismissOrSnooze) {
          alarms.splice(index, 1);
        }
        else {
          if (alarm.timeMinutes >= 55) {
            alarm.timeMinutes += 5;
            alarm.timeHours += 1;
          }
          else {
            alarm.timeMinutes += 5;
          }
        }
        alertUp = false;
      }
    });
  }
}, 1000);
createBtn.addEventListener("click", () => {
  const createAlarmContainer = document.getElementById("createAlarmContainer");
  const createAlarmBtn = document.getElementById("alarmCreatebtn");
  const title = document.getElementById("getAlarmTitle");
  const ring = document.getElementById("getAlarmRing");
  const alarmTime = document.getElementById("alarmAtTime");
  const alarmCancelbtn = document.getElementById("alarmCancelbtn");

  createAlarmContainer.style.top = "30px";
  createAlarmBtn.addEventListener("click", () => {
    if (title.value == "" || alarmTime.value == "") {
      showCustomAlert("Please fill all the fields...", "ok", false);
    }
    else {
      alarms.push({
        title: title.value,
        ring: ring.value,
        timeHours: Number.parseInt(alarmTime.value.slice(0, 2)),
        timeMinutes: Number.parseInt(alarmTime.value.slice(3))
      });
      createAlarmContainer.style.top = "-400px";
      const tempHtml = createAlarmContainer.innerHTML;
      createAlarmContainer.innerHTML = ``;
      createAlarmContainer.innerHTML = tempHtml;
    }
  });
  alarmCancelbtn.addEventListener("click", () => {
    title.value = "";
    alarmTime.value = "";
    createAlarmContainer.style.top = "-400px";
  })
});