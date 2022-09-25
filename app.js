let stationVal = ""
let lines = []
let api_url =
      "https://goodservice.io/api/stops/"

function find_lines(data) {
  while (document.getElementById("lines").firstChild) {
    document.getElementById("lines").removeChild(document.getElementById("lines").firstChild);
  }
  while (document.getElementById("train_times").firstChild) {
    document.getElementById("train_times").removeChild(document.getElementById("train_times").firstChild);
  }
  let north = data.upcoming_trips.north;
  if (!lines.includes(north[0])) {
    let lines = []
  }
  for (i = 0; i < north.length; i ++) {
    if (lines.includes(north[i].route_id)) {
    } else {
      lines.push(north[i].route_id)
      let newEl = document.createElement('option');
      newEl.setAttribute('id',north[i]);
      newEl.setAttribute('value',north[i]);
      newEl.text = north[i].route_id;
      document.getElementById("lines").appendChild(newEl)
      console.log(document.getElementById("button"))
      document.getElementById("button").innerHTML = "Load Trains"
    }
  } console.log(lines)
}

function getTrainTimes(url) {
  let line = document.getElementById('lines').value
  stationVal = document.getElementById('stations').value
  fetch(url + stationVal + '.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (lines.length == 0) {
        console.log('empty')
        find_lines(data);
      } else {
        let northTrains = data.upcoming_trips.north;
        let southTrains = data.upcoming_trips.south;
        let lineVar = document.getElementById("lines")
        line = lineVar.options[lineVar.selectedIndex].text
        get_Trains(northTrains,line,"North");
        get_Trains(southTrains,line,"South");
        lines = []
      }
    })
}

function get_Trains(our_data,line,direction) {
  let trainLine = our_data.filter(train => train.route_id == line)
  let arrivalTime =  trainLine.map(train => train.estimated_current_stop_arrival_time)
  let timeStamp = trainLine.map(train => train.timestamp)
  let times = []
  let trainText = ''
  for (i=0; i < 5; i ++) {
    let myTime = new Date(arrivalTime[i] * 1000).getMinutes()-new Date(timeStamp[i] * 1000).getMinutes()
    if (myTime < 0) {
      myTime += 60;
    }
    times.push(myTime)
  }

  for (i = 0; i < 5; i++) {
    if(times[i] < times[i-1]) {
      times[i] += 60;
    }
    if (!times[i]) {
    } else {
    trainText += times[i] + ", "
    }
  }
  let myTrainText = trainText.slice(0,-2);
  document.getElementById('train_times').appendChild(addDiv(myTrainText,line,direction));
  // addDiv(myTrainText,line,direction)
  document.getElementById("button").innerHTML = "RESET"
}

// function addItem(trainTime,line,string) {
//   let li = document.createElement('li')
//   console.log(li)
//   li.id = string
//   li.class = "fa-regular fa-train"
//   console.log(li)
//   li.textContent =  `The ${string}bound ${line} train will arrive in ` + trainTime + ' minutes'
//   console.log(li)
//   return li
// }

function addDiv(trainTime,line,string) {

  let div = document.createElement('div');
  div.class = "train_div"
  div.id = string

  let span1 = document.createElement('span');
  span1.class = string;
  span1.textContent = `The ${string}bound `;

  let span2 = document.createElement('span');
  span2.className = "logo"
  span2.textContent = line;

  if (line == "1" || line == "2" || line == "3") {
    line = "one";
    span2.id = line
  } else if (line == "4" || line == "5" || line == "6") {
    line = "four";
    span2.id = line
  } else if (line == "7") {
    line = "seven";
    span2.id = line
  } else {
    span2.id = line
  }

  let span3 = document.createElement('span');
  span3.class = "time"
  span3.textContent = ` train will arive in ` + trainTime + ' minutes'

  div.appendChild(span1)
  div.appendChild(span2)
  div.appendChild(span3)
  return div

}
