function main() {
	var listener = createXhrListenerFor('commands', syncOwner)
  
	$(document).ajaxComplete(listener)
}

function syncOwner(data) {
	xhrGetDescription(data, function() {
  	var description = getDescription(data)
    if(doesDescriptionLinkToAnotherStory(description)) {
      var setOwnerUrl = createSetOwnerUrl(data)
      xhrSetOwner(setOwnerUrl, function(data) {
      	console.log("owner updated:", data)
      }) 
    } else {
      //do nothing
    }
  })
}

function createSetOwnerUrl() {
	throw "createSetOwnerUrl"
}

function xhrSetOwner() {
	throw "xhrSetOwner"
}

function getDescription(data_fromGetStory) {
	return data_fromGetStory.description
}

function xhrGetDescription(data, asyncFunction) {
	var projectId = getTargetProjectId()
  var storyId = data.command.parameters.id
	var url = getStoryUrl(projectId)
	
  jQuery.get(url, asyncFunction)
}

function doesDescriptionLinkToAnotherStory(description) {
	var trimmed = description.trim()
  var regex = /#\d+/
  return description.match(regex) != null
}

function getRestfulActionFromUrl(url) {
  // /services/v5/commands?envelope=true
	var regex = /\/(.+)\/(.+)\/(.+)\?(.*)/
  var match = url.match(regex)
  return match[3]
}

function createXhrListenerFor(targetRestfulActionString, handlerFunction) {
	return function(a,b,data) {
  	var action = getRestfulActionFromUrl(data.url)
    if(action === targetRestfulActionString) {
    	handlerFunction(data)
    }	
  }	
}

//test framework
function write(innerHtml) {
	document.body.innerHTML += innerHtml
}

function br(innerHtml) {
	return "<br>" + innerHtml + "</br>"
}

function h1(innerHtml) {
	return "<strong style='padding-left: 12pt'>" + innerHtml + "</strong>"
}

function div() {
	innerHtml = Array.from(arguments).join(' ')
	return "<div>" + innerHtml + "</div>"
}

function describe(description, testFunction) {
	var html = br(h1(description))
  write(html)
  testFunction()
}

function test(description, testFunction) {
	var result = "test result - NULL"
  
  try {result = testFunction() }
  catch (err) {result = fail(err)}
  
	write(div(description, result))
}

function pass() {
	return "<span style='background-color: lightgreen'> pass</span>"
}

function fail(x) {
	return "<span style='background-color: lightcoral'>fail: "+x+"</span>"
}

function assertIsNotNull(x) {
	var html = "assertIsNotNull - FAIL"
	if(x==null)
  	return fail('was null')
  else
  	return pass()
}

function assertEqual(a,b) {
	var html = "assertEqual - FAIL"
	if(a==b)
  	return pass()
  else
  	return fail('expected: ' + a + ' but was: ' + b)
}

function assertTrue(a) {
	return assertEqual(a, true)
}

function assertFalse(a) {
	return assertEqual(a, false)
}

//tests
describe("", function() {
  test("getDescription", function() {
    var data_fromGetStory = {"kind":"story","id":149819592,"created_at":"2017-07-31T19:27:20Z","updated_at":"2017-08-11T21:31:31Z","estimate":2,"story_type":"feature","name":"Services running on Windows cells documented","description":"description","current_state":"unstarted","requested_by_id":1582590,"url":"url","project_id":2025095,"owner_ids":[1915255],"labels":[{"id":18970447,"project_id":2025095,"kind":"label","name":"stemcell security strategy","created_at":"2017-07-28T20:52:58Z","updated_at":"2017-07-28T20:52:58Z"}],"owned_by_id":1915255}
    
    return assertEqual('description', getDescription(data_fromGetStory))
  })
  
  test("getRestfulActionFromUrl", function() {
    var url = "/services/v5/commands?envelope=true"

    var result = getRestfulActionFromUrl(url)

    return assertEqual("commands", result)
  })
  
  
})

describe("createXhrListenerFor", function() {
	test("ignores non relevant actions", function() {
    var xhrData = {"url": "/services/v5/commands?envelope=true", "data": null}
    var result = "not called"
    var handlerFunction = function() {result = "called"}
    var xhrListener = createXhrListenerFor("junk", handlerFunction)

    xhrListener(null, null, xhrData)

    return assertEqual("not called", result)
  })

  test("executes action when relevant", function() {
    var xhrData = {"url": "/services/v5/commands?envelope=true", "data": null}
    var result = "not called"
    var handlerFunction = function() {result = "called"}
    var xhrListener = createXhrListenerFor("commands", handlerFunction)

    xhrListener(null, null, xhrData)

    return assertEqual("called", result)
  })
});

describe("doesDescriptionLinkToAnotherStory", function() {
  test("return true if the description only contains a link", function() {
      var description = "#150133717"
      var result = doesDescriptionLinkToAnotherStory(description)
      
      return assertTrue(result)
  })
  
  test("return true if the description links with extra whitespace", function() {
      var description = "  #150133717  "
      var result = doesDescriptionLinkToAnotherStory(description)
      
      return assertTrue(result)
  })
  
  test("return false if the description does not only contain a link", function() {
      var description = "something else"
      var result = doesDescriptionLinkToAnotherStory(description)
      
      return assertFalse(result)
  })
})



