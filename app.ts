let stationVal: string = ""
let lines: string[] = []
let api_url: string = "https://goodservice.io/api/stops"
let linesObject: any = {
  l: [],
  one: [],
  two: [],
  three: [],
  a: [],
  c: [],
  e: [],
  g: []
}

interface lineObject {
  name: string;
  lines: string[];
  stationId: string
}

interface directionInterface {
  id: string
  route_id: string;
  direction: string;
  previous_stop: string;
  previous_stop_arrival_time: number;
  upcoming_stop: string;
  upcoming_stop_arrival_time: number;
  estimated_upcoming_stop_arrival_time: number;
  current_stop_arrival_time: number;
  estimated_current_stop_arrival_time: number;
  distination_stop: string;
  delayed_time: number;
  schedule_discrepancy: number;
  is_delayed: boolean;
  is_assigned: boolean;
  timestamp: number;
}

function loadStations(): void {
  fetch(api_url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let lineObjectArray: lineObject[] = []
    for(let i=0; i < data.stops.length; i++) {
      let myKey: string = data.stops[i].name
      let myVal: string[] = Object.keys(data.stops[i].routes)
      let myId: string = data.stops[i].id
      let obj: lineObject = {
        name: myKey,
        lines: myVal,
        stationId: myId
      }
      lineObjectArray.push(obj)
    }
    divideStations(lineObjectArray)
  })
}

function divideStations(data: any) {
  // console.log(data)
  for (let i=0; i < data.length; i++) {
    for (let j=0; j < data[i].lines.length; j ++) {
      // console.log(data[i].name, data[i].lines[j])
      let testVar: string = `${data[i].lines[j]}`
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
  for (let i=0; i < Object.keys(linesObject).length; i ++) {
    // for (k=0; k < Object.keys(linesObject)[i].length; k ++) {
      let indexVar = Object.keys(linesObject)[i]
      let lineList: string[] = []
      let lineHTML = document.createElement('select') as HTMLSelectElement;
      // console.log(Object.keys(linesObject))
      lineHTML.setAttribute('id',indexVar + 'line');
      lineHTML.setAttribute('name',indexVar);
      let lineLabel = document.createElement('label')
      lineLabel.setAttribute('id',Object.keys(linesObject)[i])
      lineLabel.innerHTML = Object.keys(linesObject)[i]
      // console.log(lineLabel);
      lineHTML.appendChild(lineLabel)
      // lineHTML.text = indexVar
      let myDocEl = document.querySelector('#linecontainer') as HTMLInputElement
      if (myDocEl) {
        myDocEl.appendChild(lineHTML);
      }
    for (let j=0; j < linesObject[Object.keys(linesObject)[i]].length ; j ++) {
        let lineOption = document.createElement('option') as HTMLOptionElement;
        let stationName: string = linesObject[Object.keys(linesObject)[i]][j].name
        stationVal = linesObject[Object.keys(linesObject)[i]][j].id
        lineOption.setAttribute('id',stationVal);
        lineOption.setAttribute('value',stationVal);
        lineOption.text = stationName
        // lineLabel.innerHTML = linesObject[Object.keys(linesObject)[i]]
        lineHTML.appendChild(lineOption)
    }

  }
}

function find_lines(data: any) {
  let lineElement = document.querySelector('#lines') as HTMLInputElement
  while (lineElement.firstChild) {
    lineElement.removeChild(lineElement.firstChild);
  }
  let trainElement = document.querySelector("#train_times") as HTMLInputElement
  while (trainElement.firstChild) {
    trainElement.removeChild(trainElement.firstChild);
  }
  let north: directionInterface[] = data.upcoming_trips.north;
  if (north.length === 0) {
    let lines = []
  }
  for (let i = 0; i < north.length; i ++) {
    if (lines.indexOf(north[i].route_id) !== -1) {
    } else {
      lines.push(north[i].route_id)
      let newEl = document.createElement('option');
      newEl.setAttribute('id',north[i].id);
      newEl.setAttribute('value',north[i].id);
      newEl.text = north[i].route_id;
      let linesElement = document.getElementById("lines") as HTMLInputElement
      linesElement.appendChild(newEl)
      let button = document.getElementById("button") as HTMLInputElement
      button.innerHTML = "Load Trains"
    }
  }
}

function getTrainTimes(url: string) {
  let el = document.getElementById('lines') as HTMLInputElement
  let line: string = el.value
  let el2 = document.getElementById('stations') as HTMLInputElement
  stationVal = el2.value
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
        let lineVar = document.getElementById("lines") as HTMLSelectElement | null
            if (lineVar != null) {
                line = lineVar.options[lineVar.selectedIndex].text
                get_Trains(northTrains,line,"North");
                get_Trains(southTrains,line,"South");
                lines = []
            }
      }
    })
}

function get_Trains(our_data: any[],line: string, direction: string) {
  let trainLine: any = our_data.filter((train: { route_id: string }) => train.route_id == line)
  let arrivalTime =  trainLine.map((train: { estimated_current_stop_arrival_time: any }) => train.estimated_current_stop_arrival_time)
  let timeStamp = trainLine.map((train: { timestamp: any }) => train.timestamp)
  let times: number[] = []
  let trainText = ''
  for (let i=0; i < 5; i ++) {
    let myTime: number = Math.round((arrivalTime[i]-timeStamp[i])/60)
    if (myTime < 0) {
      myTime += 60;
    }
    times.push(myTime)
  }

  for (let i = 0; i < 5; i++) {
    if(times[i] < times[i-1]) {
      times[i] += 60;
    }
    if (!times[i]) {
    } else {
    trainText += times[i] + ", "
    }
  }
  let myTrainText: string = trainText.slice(0,-2);
  let trainTimes = document.getElementById('train_times') as HTMLInputElement
  trainTimes.appendChild(addDiv(myTrainText,line,direction));
  // addDiv(myTrainText,line,direction)
  let reset = document.getElementById("button") as HTMLInputElement
  reset.innerHTML = "RESET"
}

function addDiv(trainTime: string,line: string,string: string): HTMLDivElement {

  let div = document.createElement('div') as HTMLDivElement;
  div.className = "train_div" as string
  div.id = string

  let span1 = document.createElement('span') as HTMLSpanElement;
  span1.className = string as string;
  span1.textContent = `The ${string}bound ` as string;

  let span2 = document.createElement('span') as HTMLSpanElement;
  span2.className = "logo" as string;
  span2.textContent = line as string;

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

  let span3 = document.createElement('span') as HTMLSpanElement;
  span3.className = "time"
  span3.textContent = ` train will arive in ` + trainTime + ' minutes'

  div.appendChild(span1)
  div.appendChild(span2)
  div.appendChild(span3)
  return div

}
