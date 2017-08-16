function main() {
  var listener = createXhrListenerFor('commands', 'story_update', syncOwner)

  $(document).ajaxComplete(listener)
}

function syncOwner(data) {
  xhrGetDescription(data, function(description_data) {
    var description = getDescription(description_data)
    if(doesDescriptionLinkToAnotherStory(description)) {
      var descriptionLinkStoryId = getDescriptionLinkStoryId(description)
      var setOwnerData = createSetOwnerData(data)
      xhrSetOwner(descriptionLinkStoryId, setOwnerData, function(data) {
	console.log("owner updated:", data)
      })
    } else {
      console.log("description is not correct", description, descriptionLinkStoryId, description_data)
    }
  })
}

function getDescriptionLinkStoryId(descriptionLink) {
  return descriptionLink.replace("https://www.pivotaltracker.com/story/show/", "").trim()
}

function createSetOwnerData(data) {
  return data.command.parameters
}

function xhrSetOwner(storyId, data, callback) {
  var projectId = getTargetProjectId()
  var url = getStoryUrl(projectId, storyId)
  $.ajax({
    type:"PUT",
    url:url,
    data: JSON.stringify(data),
    contentType:"application/json; charset=utf-8",
    dataType:"json",
    success: callback
  })
}

function getDescription(data_fromGetStory) {
  return data_fromGetStory.description
}

function getStoryUrl(projectId, storyId) {
  return '/services/v5/projects/'+ projectId + '/stories/' + storyId
}

function xhrGetDescription(data, asyncFunction) {
  var projectId = getSourceProjectId()
  var storyId = data.command.parameters.id
  var url = getStoryUrl(projectId, storyId)

  jQuery.get(url, function(a,b,c) {
    console.log("xhrGetDescriptionSuccess", a,b,c)
    asyncFunction(a)
  })
}

function getTargetProjectId() {
  return "1479998"
}

function getSourceProjectId() {
  return "2025095"
}

function doesDescriptionLinkToAnotherStory(description) {
  var trimmed = description.trim()
  var regex = /#\d+/
  return description.match(regex) != null
}

function getRestfulActionFromUrl(url) {
  // /services/v5/commands?envelope=true
  // /services/v5/aggregateor
  if(url == '/services/v5/commands?envelope=true')
    return 'commands'
  else
    return 'dont care'
}

function getCommandType(data) {
  if (data == null)
    return "DATA MISSING"
  if (data.command == null)
    return "DATA.COMMAND IS MISSING"
  if (data.command.type == null)
    return "DATA.COMMAND.TYPE IS MISSING"
  return data.command.type
}

function createXhrListenerFor(targetRestfulActionString, targetCommandTypeString, handlerFunction) {
  return function(a,b,data) {
    var innerData = JSON.parse(data.data)
    var url = data.url
    var action = getRestfulActionFromUrl(url)
    var commandType = getCommandType(innerData)
    if(action === targetRestfulActionString && commandType == targetCommandTypeString) {
      handlerFunction(innerData)
    }	else {
      console.log("ignoring:", "commandType", commandType, "action", action, url, innerData)
    }
  }
}
