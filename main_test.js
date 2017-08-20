////////////////////////////////
//test framework
////////////////////////////////
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
})

describe("getRestfulActionFromUrl", function() {
  test("handles command url", function() {
    var url = "/services/v5/commands?envelope=true"

    var result = getRestfulActionFromUrl(url)

    return assertEqual("commands", result)
  })

  test("handles aggregate url", function() {
    var url = "/services/v5/aggregator"

    var result = getRestfulActionFromUrl(url)

    return assertEqual("dont care", result)
  })
})

describe("createExecuteIfMatchingCommand(", function() {
  test("ignores non relevant actions", function() {
    var xhrData = { data: '{"url": "/services/v5/aggregateor"}' }
    var result = "not called"
    var handlerFunction = function() {result = "called"}
    var xhrListener = createExecuteIfMatchingCommand("commands", "story_update", handlerFunction)

    xhrListener(null, null, xhrData)

    return assertEqual("not called", result)
  })
  
  test("ignores bad data", function() {
    var xhrData = {"url": "/services/v5/commands"}
    var result = "not called"

    var handlerFunction = function() {result = "called"}
    var xhrListener = createExecuteIfMatchingCommand("commands", "story_update", handlerFunction)

    xhrListener(null, null, xhrData)

    return assertEqual("not called", result)
  })

  test("ignores non relevant command types", function() {
    var commandData = '{"command":{"type":"comment_create"}}'
    var xhrData = {"url": "/services/v5/aggregateor", "data": commandData}
    var result = "not called"
    var handlerFunction = function() {result = "called"}
    var xhrListener = createExecuteIfMatchingCommand("commands", "story_update", handlerFunction)

    xhrListener(null, null, xhrData)

    return assertEqual("not called", result)
  })

  test("executes action when relevant", function() {
    var commandData = '{"command":{"type":"story_update"}}'
    var xhrData = {"url": "/services/v5/commands?envelope=true", "data": commandData}
    var result = "not called"
    var handlerFunction = function() {result = "called"}
    var xhrListener = createExecuteIfMatchingCommand("commands", "story_update", handlerFunction)

    xhrListener(null, null, xhrData)

    return assertEqual("called", result)
  })
});

describe("doesDescriptionLinkToAnotherStory", function() {
  test("return true if the description only contains a link", function() {
    var description = "https://www.pivotaltracker.com/story/show/123"
    var result = doesDescriptionLinkToAnotherStory(description)

    return assertTrue(result)
  })

  test("return true if the description contains an id", function() {
    var description = "#123"
    var result = doesDescriptionLinkToAnotherStory(description)

    return assertTrue(result)
  })

  test("return true if the description links with extra whitespace", function() {
    var description = "    https://www.pivotaltracker.com/story/show/123   "
    var result = doesDescriptionLinkToAnotherStory(description)

    return assertTrue(result)
  })

  test("return false if the description does not only contain a link", function() {
    var description = "something else"
    var result = doesDescriptionLinkToAnotherStory(description)

    return assertFalse(result)
  })
})

describe("getCommandType", function() {
  test("return command type", function() {
    var data = {"command":{"type":"story_update",}}
    var result = getCommandType(data)

    return assertEqual("story_update", result)
  })

  test("if data is missing", function() {
    var data = null
    var result = getCommandType(data)

    return assertEqual("DATA MISSING", result)
  })

  test("if command is missing", function() {
    var data = {}
    var result = getCommandType(data)

    return assertEqual("DATA.COMMAND IS MISSING", result)
  })

  test("if type is missing", function() {
    var data = {"command": {}}
    var result = getCommandType(data)

    return assertEqual("DATA.COMMAND.TYPE IS MISSING", result)
  })
})

describe("getStoryParameters", function() {
  test("grabs the data", function() {
    var data = {"person_id":2854507,"project":{"id":2025095,"version":2685},"command":{"type":"story_update","command_uuid":"acf13aa0-9b61-45df-a788-52d4a1ca3c01","parameters":{"owner_ids":[2179671,2854507],"id":150219631}}}

    var result = getStoryParameters(data)
    var expected = {"owner_ids":[2179671,2854507],"id":150219631}
    return assertEqual(JSON.stringify(expected), JSON.stringify(result))
  })
})

describe("getDescriptionLinkStoryId", function() {
  test("with link", function() {
    var description = "https://www.pivotaltracker.com/story/show/134"

    var result = getDescriptionLinkStoryId(description)

    return assertEqual("134", result)
  })
  test("with id", function() {
    var description = "#134"

    var result = getDescriptionLinkStoryId(description)

    return assertEqual("134", result)
  })
  test("works with whitespace", function() {
    var description = "  https://www.pivotaltracker.com/story/show/134   "

    var result = getDescriptionLinkStoryId(description)

    return assertEqual("134", result)
  })
})

describe("aggregateListeners", function() {
  test("they are called", function() {
    var a = "a not called"
    var b = "b not called"
    var listenerA = function() { a = "a was called" }
    var listenerB = function() { b = "b was called" }
    var listeners = aggregateListeners(listenerA, listenerB)

    listeners()

    return assertEqual("a was called", a)
         + assertEqual("b was called", b)
  })

  test("arguments are passed in", function() {
    var aA,bA='a not set'
    var aB,bB='b not set'
    var listenerA = function(a, b) { aA = a; bA = b; }
    var listenerB = function(a, b) { aB = a; bB = b; }
    var listeners = aggregateListeners(listenerA, listenerB)

    listeners('a set', 'b set')

    return assertEqual("a set", aA)
         + assertEqual("b set", bA)
         + assertEqual("a set", aB)
         + assertEqual("b set", bB)
  })
})

