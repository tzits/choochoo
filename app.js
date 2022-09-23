let stationVal = ""
let lines = []
let api_url =
      "https://goodservice.io/api/stops/"

function find_lines(data) {
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
        // this is a placeholder bs line, need to find way to generate options once lines
        // station is found
        line = lines[0]
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
  document.getElementById('train_times').appendChild(addItem(myTrainText,line,direction));
}

function addItem(trainTime,line,string) {
  let li = document.createElement('li')
  console.log(li)
  li.id = string
  li.class = "fa-regular fa-train"
  console.log(li)
  li.textContent =  `The ${string}bound ${line} train will arrive in ` + trainTime + ' minutes'
  console.log(li)
  return li
}
