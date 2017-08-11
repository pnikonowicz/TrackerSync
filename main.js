data = {"person_id":2854507,"project":{"id":2025095,"version":2549},"command":{"type":"story_update","command_uuid":"020a9ba0-40e1-4dc8-a667-4cb7bf8b320e","parameters":{"owner_ids":[1915255],"id":149819592}}}

function getProjectId(data) {
	return data.project.id
}

function getStoryId(data) {
	return data.command.parameters.id
}

function getStoryOwners(data) {
	return data.command.parameters.owner_ids
}


//test framework
function assertIsNotNull(x) {
	if(x==null)
  	document.body.innerHTML += "<br>fail: was null</br>"
  else
  	document.body.innerHTML += "<br>pass</br>"
}

//tests
assertIsNotNull(getProjectId(data))
assertIsNotNull(getStoryId(data))
assertIsNotNull(getStoryOwners(data))
