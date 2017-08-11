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

//test framework
function pass() {
	document.body.innerHTML += "<br>pass</br>"
}

function fail(x) {
	document.body.innerHTML += "<br>fail: "+x+"</br>"
}

function assertIsNotNull(x) {
	if(x==null)
  	fail('was null')
  else
  	pass()
}

function assertEqual(a,b) {
	if(a==b)
  	pass()
  else
  	fail('expected: ' + a + ' but was: ' + b)
}

//tests
assertIsNotNull(getProjectId(data))
assertIsNotNull(getStoryId(data))
assertIsNotNull(getStoryOwners(data))
assertEqual('/services/v5/projects/a/stories/b', getStoryUrl('a','b'))
assertEqual('description', getDescription(data_fromGetStory))


