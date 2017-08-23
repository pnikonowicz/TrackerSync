# TrackerSync

This allows two columns to be in sync. After installing, configure the columns to sync by entering in their respective project ids in the plugin drop down from your chrome browser. 

Note: this currently only sync's story data. Tasks, comments, blockers, etc will not sync automatically. 

## To get the project ids for the source and destination fields:

grab the project Id from your url. For example:

https://www.pivotaltracker.com/n/projects/{PROJECT_ID}

## To link a story
Next, any story you want sync'd needs to have the story id in the description of the source story. 

For example

![descrption example](https://github.com/pnikonowicz/TrackerSync/blob/master/images/description.png?raw=true)
