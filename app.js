let stationVal = ""
let lines = []
let api_url = "https://goodservice.io/api/stops"
let linesObject = {
  l: [],
  one: [],
  two: [],
  three: [],
  a: [],
  c: [],
  e: [],
  g: []
}

function loadStations() {
  fetch(api_url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let lineObjectArray = []
    for( i=0; i < data.stops.length; i++) {
      let myKey = data.stops[i].name
      let myVal = Object.keys(data.stops[i].routes)
      let myId = data.stops[i].id
      let obj = {
        name: myKey,
        lines: myVal,
        stationId: myId
      }
      lineObjectArray.push(obj)
    }
    divideStations(lineObjectArray)
  })
}

function divideStations(data) {
  // console.log(data)
  for (i=0; i < data.length; i++) {
    for (j=0; j < data[i].lines.length; j ++) {
      // console.log(data[i].name, data[i].lines[j])
      let testVar = `${data[i].lines[j]}`
      if (testVar == "L") {
          linesObject.l.push({
          name: data[i].name,
          id: data[i].stationId
        })
      } else if (testVar == "A") {
          linesObject.a.push({
          name: data[i].name,
          id: data[i].stationId
        })
      } else if (testVar == "C") {
          linesObject.c.push({
          name: data[i].name,
          id: data[i].stationId
          })
      } else if (testVar == "E") {
          linesObject.e.push({
          name: data[i].name,
          id: data[i].stationId
          })
      } else if (testVar == "1") {
          linesObject.one.push({
          name: data[i].name,
          id: data[i].stationId
          })
      } else if (testVar == "2") {
          linesObject.two.push({
          name: data[i].name,
          id: data[i].stationId
          })
      } else if (testVar == "3") {
          linesObject.three.push({
          name: data[i].name,
          id: data[i].stationId
          })
      } else if (testVar == "G") {
        linesObject.g.push({
          name: data[i].name,
          id: data[i].stationId
          })
      }
    }
  }
  // console.log(linesObject)
  for (i=0; i < Object.keys(linesObject).length; i ++) {
    // for (k=0; k < Object.keys(linesObject)[i].length; k ++) {
      let indexVar = Object.keys(linesObject)[i]
      let lineList = []
      let lineHTML = document.createElement('select');
      console.log(Object.keys(linesObject))
      lineHTML.setAttribute('id',indexVar + 'line');
      lineHTML.setAttribute('name',indexVar);
      let lineLabel = document.createElement('label')
      lineLabel.setAttribute('id',Object.keys(linesObject)[i])
      lineLabel.innerHTML = Object.keys(linesObject)[i]
      console.log(lineLabel);
      lineHTML.appendChild(lineLabel)
      // lineHTML.text = indexVar
      document.getElementById('linecontainer').appendChild(lineHTML);
        for (j=0; j < linesObject[Object.keys(linesObject)[i]].length ; j ++) {
          let lineOption = document.createElement('option');
          let stationName = linesObject[Object.keys(linesObject)[i]][j].name
          let stationVal = linesObject[Object.keys(linesObject)[i]][j].id
          lineOption.setAttribute('id',stationVal);
          lineOption.setAttribute('value',stationVal);
          lineOption.text = stationName
          // lineLabel.innerHTML = linesObject[Object.keys(linesObject)[i]]
          lineHTML.appendChild(lineOption)
        }

  }
}

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
      document.getElementById("button").innerHTML = "Load Trains"
    }
  }
}

function getTrainTimes(url) {
  let line = document.getElementById('lines').value
  stationVal = document.getElementById('stations').value
  fetch(url + '/' + stationVal + '.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (lines.length == 0) {
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
    let myTime = Math.round((arrivalTime[i]-timeStamp[i])/60)
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
