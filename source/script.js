// References to field elements
var patientQueryHolder = document.getElementById("patientQuery")
var languageHolder = document.getElementById("language")
var signUpBtn = document.getElementById('signup');
var result = document.getElementById('statusBox');
var reasonDiv = document.getElementById('reasonBox');
var answerState = document.getElementById("answerState");
var headingElement = document.getElementById("title");

// References to values stored in the plug-in parameters
var title = getPluginParameter('title');
var patientName = getPluginParameter('patientName');
var phoneNumber = getPluginParameter('phoneNumber');
var patientQuery = getPluginParameter('patientQuery');
var agentEmail = getPluginParameter('agentEmail');
var projectId = getPluginParameter('projectId');
var familyConnectedOnWa = getPluginParameter('familyConnectedOnWa');
var language = getPluginParameter('language');
var apiToken = getPluginParameter('apiToken');
var apiUrl = getPluginParameter('apiUrl');
var fdUrl = getPluginParameter('fdUrl');
var currentAnswer = fieldProperties.CURRENT_ANSWER;




headingElement.innerText = title || "FD Ticket Create";
patientQueryHolder.innerText = patientQuery;
languageHolder.innerText = language;
setCurrentStatus();


function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [day, month, year].join('-');
}


function formatDateTime(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hours = '' + d.getHours(),
    minutes = '' + d.getMinutes();

  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  if (hours.length < 2)
    hours = '0' + hours;
  if (minutes.length < 2)
    minutes = '0' + minutes;

  return [day, month, year].join('-') + ' ' + strTime;
}


// Define the dial function
signUpBtn.onclick = function () {
  apiCall()
}

function processResponse(data) {
  var status = data['status'] == "success" ? 'Success' : 'Failure'
  var statusClass = data['status'] == "success" ? 'success' : 'danger';
  if (status == "Success") {
    setResult(statusClass, status, "Ticket created!")
    var ticketUrl = fdUrl + "/a/tickets/" + data['ticket_id'];
    setAnswer(ticketUrl);
  }
  else if (status == "Failure") {
    setResult(statusClass, status, "Ticket couldn't be created!")
  }
}

function parseError(data) {
  var errors = data;
  var outputString = '';
  if (errors.length === 0) {
    outputString = "";
  } else if (errors.length === 1) {
    outputString = '<strong>' + errors[0]['field'] + '</strong> : ' + errors[0]['message'];
  }
  else {
    for (let i = 0; i < errors.length - 1; i++) {
      outputString = '<strong>' + errors[i]['field'] + '</strong> : ' + errors[i]['message'] + '</br>';
    }
    outputString += '<strong>' + errors[errors.length - 1]['field'] + '</strong> : ' + errors[errors.length - 1]['message'];
  }
  return outputString;
}

function makeHttpObject() {
  try {
    return new XMLHttpRequest()
  } catch (error) { }
  try {
    return new ActiveXObject('Msxml2.XMLHTTP')
  } catch (error) { }
  try {
    return new ActiveXObject('Microsoft.XMLHTTP')
  } catch (error) { }

  throw new Error('Could not create HTTP request object.')
}

function setResult(resultClass, resultText, reason = null, html = false) {
  t1 = result.classList.replace("danger", resultClass);
  t2 = result.classList.replace("success", resultClass);

  if ((t1 || t2) == false) {
    result.classList.add(resultClass);
  }
  result.innerText = resultText;
  if (reason != null) {
    reasonDiv.classList.add('reason');
    if (html == true) {
      reasonDiv.innerHTML = reason;
    }
    else {
      reasonDiv.innerText = reason;
    }
    var metadata = {
      "status": resultText, "reason": reason, "timestamp": new Date(), "html": html
    }
    setMetaData(JSON.stringify(metadata));
  }
}

function setCurrentStatus() {
  var metadata = JSON.parse(getMetaData());
  if (metadata != null) {
    var last_response_time = formatDateTime(metadata['timestamp']);
    if (metadata["status"] == "Success") {
      setResult("success", "Success", metadata['reason'], metadata['html']);
      if (last_response_time != undefined) {
        answerState.innerHTML = "* Last recorded server response at " + last_response_time;
      }
    }
    else if (metadata["status"] == "Failure") {
      setResult("danger", "Failure", metadata['reason'], metadata['html']);
      if (last_response_time != undefined) {
        answerState.innerHTML = "* Last recorded server response at " + last_response_time;
      }
    }
  }
}

function createPayload(name, phoneNumber, patientQuery, agentEmail, familyConnectedOnWa, projectId = "TT Check up - Experiment1", language = null, type = "Tele Trainer", country = "India") {
  var yesValues = ["Yes", "YES", "yes", "1"];
  var noValues = ["No", "NO", "no", "0"];

  var whatsappValue;
  if (noValues.indexOf(familyConnectedOnWa) !== -1) {
    whatsappValue = "No";
  }

  if (yesValues.indexOf(familyConnectedOnWa) !== -1) {
    whatsappValue = "Yes";
  }

  return {
    "name": name,
    "phone": phoneNumber,
    "type": type,
    "subject": "TT Experiment 1 " + phoneNumber,
    "description": patientQuery,
    "tags": ["surveycto-plugin"],
    "agent_email": agentEmail,
    "custom_fields": {
      "cf_project": projectId,
      "cf_regional_language": language,
      "cf_family_connected_on_wa": whatsappValue,
      "cf_country": country
    }
  }
}


function apiCall() {
  try {
    request = makeHttpObject()
    payload = createPayload(
      patientName, phoneNumber, patientQuery, agentEmail, familyConnectedOnWa, projectId, language
    )

    request.open('POST', apiUrl, true)
    request.setRequestHeader('Authorization', 'Token ' + apiToken)
    request.setRequestHeader('Content-type', ' application/json')

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status == 200) {
          try {
            var response = JSON.parse(request.responseText);
            processResponse(response);
          }
          catch {
            setResult("danger", "Failure", "Error occured while parsing response")
          }
        }
        else if (request.status == 400) {
          var errorResponse = JSON.parse(request.responseText);
          var errorMessage = parseError(errorResponse);
          setResult("danger", "Failure", errorMessage, html = true);
        }
        else if (request.status == 404) {
          setResult("danger", "Failure", "Server returned 404")
        }
        else if (request.status == 500) {
          setResult("danger", "Failure", "Server returned 500")
        }
        else if (request.status == 429) {
          setResult("danger", "Failure", "Rate limited, please try again in some time!")
        }
        else {
          setResult("danger", "Failure", request.responseText)
        }
      }
    }
    request.onerror = function () {
      setResult("danger", "Failure", "Network Error, please check your internet connection!")
    }

    request.send(JSON.stringify(payload));
  } catch (error) {
    setResult("danger", "Failure", error);
  }
}
