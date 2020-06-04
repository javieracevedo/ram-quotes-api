## Rick and Morty random quotes API

### Introduction

API to get random quotes the rick and morty sitcom. This is a simple API for getting random rick and morty quotes, this isn't fully completed yet, it's my first time working with backend technology, so this is purely educational for me. Also this project was bootstraped from the repo of the frontend masters api design in node by Hendrixer.

### How to run

Run the following commands in the root of the project.

```
npm install && npm run dev
```

### Running tests

To run quote tests

```
npm run test-quotes-controllers
npm run test-quotes-models
```

To run character tests

```
npm run test-characters-controller
npm run test-characters-models
```

To run auth controllers tests

```
npm run test-auth
```


### Endpoints


**Character endpoints:**

| type          | url                | query | body             |
| ------------- |:------------------:| -----:| :---------------:|
|   POST        | /characters        |       | { name: 'Rick' } |
|   GET         | /characters |      |       |                  |
|   DEL         | /characters/:id    |       |                  |
|   DEL         | /characters/:id    |       |                  |

**Quote endpoints:**

| type          | url                | query                 | body                                               |
| ------------- |:------------------:| ---------------------:| :-------------------------------------------------:|
|   POST        | /quotes            |                       | { quote: 'some quote', character: "character-id" } |
|   GET         | /quotes            | character_name="rick" |                                                    |
|   DEL         | /quotes/:id        |                       |                                                    |
