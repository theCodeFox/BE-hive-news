# NC - Knews

Allows user to create their own articles and comments or read other articles. They can comment and vote on what they like or dislike and make changes to the articles or comment including deleting what is no longer needed.

## Getting Started

1. Fork from GitHub: https://github.com/theCodeFox/BE2-NC-Knews
2. Clone into the directory that you will be working from
3. Install all dependancies and dev-dependancies (see Installing below)
4. TDD everything!
5. Deploy (see Deployment below)
6. Play around and most importantly... have fun!

### Prerequisites

Below is examples of what I used, but alternatives are available. If you find something that you prefer, please drop me the suggestion on GitHub!

```
Command Line Interface: iTerm/bash
Source Code Editor: Visual Studio Code
Object-Relational DB Management System: Postgres
Cross Platform REST client: Insomnia
Hosting Platform: Heroku
```

### Installing

Once you have cloned the repo then cd into the directory. From here:

Install dependancies

```
npm install body-parser express knex pg pg-promise fs
```

Install dev-dependancies

```
npm install chai mocha nodemon supertest -D
```

Optional dev-dependancies

```
npm install husky -D
extention (VSC) - eslint
```

Optional nyan reporter (if you DO NOT want nyan cat to watch over you, please remove ' --reporter nyan' from test script in package.json)

```
npm install --save-dev karma-nyan-reporter
```

Next you will need a knexfile.js - this will allow you to set which data you are testing with so you don't accidently delete or change something that you really wish you didn't! It should look something like this:

```js
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  seeds: {
    directory: './db/seeds',
  },
  migrations: {
    directory: './db/migrations',
  },
};

const dbConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
  development: {
    connection: {
      database: 'news',
    },
  },
  test: {
    connection: {
      database: 'news_test',
    },
  },
};

module.exports = { ...baseConfig, ...dbConfig[ENV] };
```

Don't forget a gitignore file!

```
node_modules
knexfile.js
config   <-- This is where I put anything I was using to manually check data (e.g query.sql) - optional
```

Finally to migrate and seed:

```
npm run setup-dbs
npm run make-migration
npm run seed
```

Here is a little example of the output at endpoint: /api/comments/:comment_id

```js
{ comment_id: 1,
  author: 'butter_bridge',
  article_id: 9,
  votes: 17,
  created_at: 2017-11-22T12:36:03.389Z,
  body:
   'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!' }
   ```

## Running the tests

The automated tests are in the spec folder on route. To run TDD:

```
npm test
```

If you wish to test using a REST client then I would recomment [Insomnia](https://insomnia.rest/)


### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### ESLint & Husky

Explain what these tests test and why

```r
NC-Knews/errors/errors.js
  19:3  warning  Unexpected console statement  no-console

✖ 1 problem (0 errors, 1 warning)
```

## Deployment using Heroku

1. Log into Heroku using the command line:
```
heroku login
```
2. In the directory where your server exists create heroku named app using command line:
```html
heroku create <app-name>
```
3. Do `git push heroku master`
4. Go to the heroku site and login. Choose your application and provide an `add-on` of `Heroku Postgres`
5. Check that the database exists. Click settings on it, and view the credentials. `Keep an eye on the URI. Don't close this yet!`
6. On your command line, type:
```
heroku config:get DATABASE_URL
```
NOTE: If you're in your app's directory, and it is correctly linked as an add on to heroku, it should display a DB URI string that is exactly the same as the one in your credentials.

7. Commit any changes, and push to heroku master. `Make sure you migrate and seed prod scripts` (in order!) from your package.json. 
15. Review your app with `heroku open`
16. Any issues should be debugged with `heroku logs --tail`!

Good luck!


## Endpoints

`/api` 
* **GET** - returns with endpoints JSON object

`/api/topics`
* **GET** - returns with array of topic objects containing slug and description properties
* **POST** - accepts a topic object containing unique slug and description then returns with posted topic object

`/api/articles`
* **GET**" - accepts queries of author, topic, sort_by(default - date), order (default - desc), limit (default - 10) and p (stands for page at which to start - calculated using limit) - multiple queries can be given, then returns with array of article objects containing author (username from users table), title, article_id, topic, created_at, votes, comment count and article count (total count of filtered articles, discounting limit)
* **POST** - accepts an article object containing title, body, topic, username, then returns with posted article object

`/api/articles/:article_id`
* **GET** - returns with an article object containing author (username from user table), title, article_id, body, topic, created_at, votes, comment_count
* **PATCH** - accepts an object in form { inc_votes: newVote } where newVote indicates how much the votes property in the database should be updated by, then returns with updated article
* **DELETE** - returns with status 204 and no content if deletes given article

`/api/articles/:article_id/comments`
* **GET** - accepts queries sort_by (default - date), order (default - desc), limit (default - 10) and p (stands for page at which to start - calculated using limit), then returns with array of comment objects for the given article containing comment_id, votes, created_at, author (username from users table) and body
* **POST** - accepts a comment object containing username and body, then returns with posted comment article

`/api/comments/:comment_id`
* **PATCH** - accepts an object in form { inc_votes: newVote } where newVote indicates how much the votes property in the database should be updated by, then returns with updated comment
* **DELETE** - returns with status 204 and no content if deletes given comment

`/api/users`
* **GET** - returns with array of user objects containing username, avatar_url and name
* **POST** - accepts an object containing username, avatar_url and name, then returns with posted user object

`/api/users/:username`
* **GET** - returns with user object containing username, avatar_url, name

## Contributing

This is a course project for study purposes. Rights go to Northcoders who provided the course and assisted with studying.

`As a solo sprint there is to be no contributing.`

## Versioning
* Visual Studio Code - 15.0
* Insomnia - 6.3.1
* Postgres - 10.7
* npm - 6.8.0

```json
  "dependencies": {
    "body-parser": "^1.18.3",
    "express": "^4.16.4",
    "fs": "0.0.1-security",
    "knex": "^0.15.2",
    "pg": "^7.8.1",
    "pg-promise": "^8.5.6"
  },
  "devDependencies": {
    "chai": "^4.2.0",
    "eslint": "^5.9.0",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-plugin-import": "^2.14.0",
    "husky": "^1.3.1",
    "karma-nyan-reporter": "^0.2.5",
    "mocha": "^6.0.2",
    "nodemon": "^1.18.10",
    "supertest": "^3.4.2"
```


## Authors

* **Kay Fox** - *Initial work* - [theCodeFox](https://github.com/theCodeFox)

## License

This project is licensed under the ISC License

## Acknowledgments

* NorthCoders! (https://northcoders.com) - A massive thank you for all assistance, teaching, lectures and above all patience.
