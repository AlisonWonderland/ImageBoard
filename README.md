# ImageBoard

### todo
* Implement replies list for thread and comment
* create comment button? but remove it for the thread view.
* going to need to maxheight for lazy load
* fitting content into screen

### Performance notes
* Uploading a file to s3 as a stream is faster than uploading it as a buffer.
* Current benchmark webm + thumbnail upload is ~8 seconds 
* Current benchmark jpg + thumbnail upload is ~1.1 seconds 