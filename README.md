# ImageBoard

## Important feature notes
* Sometimes replies won't update because they're not in cache yet.

### todo
* going to need to maxheight for lazy load
* fitting content into screen
* Refactoring/cleaning

### Performance notes
* Uploading a file to s3 as a stream is faster than uploading it as a buffer.
* Current benchmark webm + thumbnail upload is ~8 seconds 
* Current benchmark jpg + thumbnail upload is ~1.1 seconds 