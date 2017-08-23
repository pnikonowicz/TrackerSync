function serialize() {
  var elements = inputElements()
  var myJson = {}
  for(var i=0; i<elements.length; i++) {
    var element = elements[i]
    inputAccessorHelper(
      element,
      function(element){myJson[element.name] = element.checked},
      function(element){myJson[element.name] = element.value}
    )
  }
  return myJson
}

function inputElements() {
  var elements = document.getElementsByTagName('input')
  return elements
}

function saveChanges() {
  var modelToSave = serialize()
  chrome.storage.sync.set({"TrackerSyncModel": modelToSave}, function() {console.log('saved model', modelToSave)})
}

function listenForInputElementChanges() {
  var elements = inputElements()
  for(var i=0; i<elements.length; i++) {
    elements[i].addEventListener('change', saveChanges, false);
  }
}

function loadInputElementsFromStorage() {
  chrome.storage.sync.get("TrackerSyncModel", function(data) {
    var trackerSyncModel = data["TrackerSyncModel"]
    for(var key in trackerSyncModel) {
      var element = document.getElementsByName(key)[0]
      var value = trackerSyncModel[key]
      inputAccessorHelper(
        element,
        function(element){element.checked = value},
        function(element){element.value = value}
      )
    }
  })
}

function inputAccessorHelper(element, ifCheckbox, ifText) {
  if(element.type == 'text') {
    ifText(element)
  } else if(element.type == 'checkbox') {
    ifCheckbox(element)
  } else {
    console.log("unknown type", element)
  }
}

document.addEventListener("DOMContentLoaded", listenForInputElementChanges, false);
document.addEventListener("DOMContentLoaded", loadInputElementsFromStorage, false);
