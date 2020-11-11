## File System and Streams

Folder: app

Run server: `node app/server`

####Files:

Express App: [app/server/Index.js](server/Index.js)

Routs handlers: [app/server/events/index.js](server/events/index.js)

####Available endpoints:

Get filtered events: 
    
    curl localhost:3000/events?location=lviv

Get single event:

    curl localhost:3000/events/2
    
Delete specific event:

    curl --request DELETE http://localhost:3000/events/3

Create new event:

    curl --request POST 'http://localhost:3000/events' \
    --header 'Content-Type: application/json' \
    --data-raw '{
       "id": 4,
       "title": "meeting4",
       "location": "dnepr",
       "date": "12-12-2020",
       "hour": "13:00"
    }'
    
Update event:

    curl --location --request PUT 'http://localhost:3000/events/4' \
    --header 'Content-Type: application/json' \
    --data-raw '{
       "id": 4,
       "title": "meeting4_New",
       "location": "dnepr1_New",
       "date": "10-10-2020",
       "hour": "14:20"
    }'

Get batch of events using stream:

    curl localhost:3000/events-batch 