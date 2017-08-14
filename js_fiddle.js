var data = {"person_id":2854507,"project":{"id":2025095,"version":2549},"command":{"type":"story_update","command_uuid":"020a9ba0-40e1-4dc8-a667-4cb7bf8b320e","parameters":{"owner_ids":[1915255],"id":149819592}}}

var data_fromGetStory = {"kind":"story","id":149819592,"created_at":"2017-07-31T19:27:20Z","updated_at":"2017-08-11T21:31:31Z","estimate":2,"story_type":"feature","name":"Services running on Windows cells documented","description":"description","current_state":"unstarted","requested_by_id":1582590,"url":"url","project_id":2025095,"owner_ids":[1915255],"labels":[{"id":18970447,"project_id":2025095,"kind":"label","name":"stemcell security strategy","created_at":"2017-07-28T20:52:58Z","updated_at":"2017-07-28T20:52:58Z"}],"owned_by_id":1915255}

function getProjectId(data) {
	return data.project.id
}

function getStoryId(data) {
	return data.command.parameters.id
}

function getStoryOwners(data) {
	return data.command.parameters.owner_ids
}

function getStoryUrl(projectId, storyId) {
	return '/services/v5/projects/'+ projectId + '/stories/' + storyId
}

function getDescription(data_fromGetStory) {
	return data_fromGetStory.description
}

//////////

function main() {
	var listener = createXhrListenerFor('commands', syncOwner)
  
	$(document).ajaxComplete(listener)
}

function syncOwner(url, dataToSync) {
	throw "syncOwner"
}

function listenForXhrEvent(name, action) {
	throw "listenForXhrEvent"
}

function createXhrListenerFor(restfulAction, handlerFunction) {
	throw "createXhrListenerFor"
}

//test framework
function write(innerHtml) {
	document.body.innerHTML += innerHtml
}

function br(innerHtml) {
	return "<br>" + innerHtml + "</br>"
}

function div() {
	innerHtml = Array.from(arguments).join(' ')
	return "<div>" + innerHtml + "</div>"
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

//tests
test("getProjectId", 	function() {
	return assertIsNotNull(getProjectId(data)) 
})

test("getStoryId", function() {
	return assertIsNotNull(getStoryId(data))
})

test("getStoryOwners", function() {
	return assertIsNotNull(getStoryOwners(data))
})
 
test("getStoryUrl", function() {
	return assertEqual('/services/v5/projects/a/stories/b', getStoryUrl('a','b'))
})

test("getDescription", function() {
	return assertEqual('description', getDescription(data_fromGetStory))
})

test("createXhrListenerFor - ignores non relevant actions", function() {
	var xhrData = {"url": "/services/v5/commands?envelope=true", "data": null}
	var result = "not called"
	var handlerFunction = function() {result = "called"}
	var xhrListener = createXhrListenerFor("junk", handlerFunction)
  
  return assertEqual("not called", result)
})
