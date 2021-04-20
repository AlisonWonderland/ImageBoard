# ImageBoard

A MERN stack web app where users can anonymously post messages and share images under certain thread topics. It currently supports jpg/jpeg, gif and webm formatted media.


By working on this project I learned a variety of new technologies like AWS S3 and reinforced 

## Installation
Clone repo
```
git clone https://github.com/AlisonWonderland/ImageBoard.git
```

Install dev dependencies in both root folder and backend using:
```
npm install
```

Install Memcached
```
sudo apt update
sudo apt install memcached
sudo apt install libmemcached-tools
```
Here's a link for further installation options: https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-memcached-on-ubuntu-18-04

## Running the app

First start up Memcached. Note that the app will still work without starting Memcached, but will cause a large delay in fetching data from the api.
```
sudo service memcached start
```

A success message should appear.

To start frontend, go to root directory and execute
```
npm start
```

And finally to start backend go to backend directory and execute
```
npm run dev
```
to run in dev mode using nodemon or use
```
npm start
```
to run backend without nodemon

## Tech used
* MongoDB
    * To store comments and threads.
* Express
* React
* Node.js
* Memcached
    * To cache MongoDB queries and reduce the strain on the database
    * To speed up response times
* AWS S3 Bucket
    * To store uploaded images and their thumbnails
    * To provide links to images
    * I used the Node.js AWS S3 SDK to interact with my bucket
    * I added cache-control to my images so that they could be seen in new tabs
* Jest 
    * To test some api routes

## Screenshots

### Home page showing thread previews
![](./screenshots/thread.JPG)
### Home page with create thread form showing
![](./screenshots/thread_with_form_opened.JPG)
### Catalog page
![](./screenshots/catalog.JPG)
### Full Thread
![](./screenshots/thread_open.JPG)

## Important feature notes
* Sometimes replies won't update because they're not in cache yet.

### Performance notes
* Current benchmark webm + thumbnail upload is ~8 seconds 
* Current benchmark jpg + thumbnail upload is ~1.1 seconds 