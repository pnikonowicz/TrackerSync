function main() {
  var task_create_listener = createCommandListener("POST", getStoryIdFromTaskData, getTaskCreateUrl, 'task_create')
  var story_update_listener = createCommandListener("PUT", getStoryIdFromStoryData, getStoryUrl, 'story_update')
  var listeners = aggregateListeners(task_create_listener, story_update_listener)
  $(document).ajaxComplete(listeners)
}

function aggregateListeners() {
  var outterArgs = arguments
  return function() {
    for(var i=0; i<outterArgs.length; i++) {
      outterArgs[i].apply(this, arguments)
    }
  }
}

function getTaskCreateUrl(projectId, storyId) {
  return '/services/v5/projects/'+ projectId + '/stories/' + storyId + '/tasks'
}

function getStoryIdFromTaskData(task_data) {
  return task_data.command.parameters.story_id
}

function createCommandListener(http_method, getStoryId, urlFunc, actionString) {
  var syncStory = createSyncFunction(http_method,urlFunc)
  var executeIfLinkedStory = createExecuteIfLinkedStory(syncStory)
  var xhrGetDescription = createXhrGetDescription(getStoryId, executeIfLinkedStory)
  var listener = createExecuteIfMatchingCommand('commands', actionString, xhrGetDescription)
  return listener
}

function createXhrGetDescription(getStoryId, func) {
  return function(story_data) {
    xhrGetDescription(getStoryId, story_data, function(description_data) {
      func(story_data, description_data)
    })
  }
}

function createExecuteIfLinkedStory(func) {
  return function(story_data, description_data) {
    var description = getDescription(description_data)
    if(doesDescriptionLinkToAnotherStory(description)) {
      func(story_data, description)
    }
    else {
      console.log("description is not correct", description, description_data)
    }
  }
}

function createSyncFunction(http_method, getUrlFunc) {
  return function(story_data, description) {
    var storyId = getDescriptionLinkStoryId(description)
    var setOwnerData = getStoryParameters(story_data)
    var projectId = getTargetProjectId()
    var url = getUrlFunc(projectId, storyId)

    console.log("sync with:", url, setOwnerData)

    xhrSetOwner(http_method, url, setOwnerData, function(data) {
      console.log("owner updated:", data)
    })
  }
}

function createExecuteIfMatchingCommand(targetRestfulActionString, targetCommandTypeString, handlerFunction) {
  return function(a,b,data) {
    if(data.data == null) {
      console.log("not correct data type", data)
      return
    }
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

function getDescriptionLinkStoryId(descriptionLink) {
  return descriptionLink.replace("https://www.pivotaltracker.com/story/show/", "").replace('#', '').trim()
}

function getStoryParameters(story_data) {
  return story_data.command.parameters
}

function xhrSetOwner(http_method, url, data, callback) {
  $.ajax({
    type:http_method,
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

function getStoryIdFromStoryData(story_data) {
  return story_data.command.parameters.id
}

function xhrGetDescription(getStoryId, data, asyncFunction) {
  var projectId = getSourceProjectId()
  var storyId = getStoryId(data)
  var url = getStoryUrl(projectId, storyId)

  console.log("getDescription", url, data)
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
  lastPostSlash = description.split('/')
  var regex = /\d+/
  lastElement = lastPostSlash[lastPostSlash.length-1]
  return lastElement.match(regex) != null
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

