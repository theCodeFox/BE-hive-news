# NC - Knews

Allows user to create their own articles or read other articles. They can comment and vote on what they like or dislike and make changes to the articles or comment including deleting what is no longer needed.

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
Hosting Platform: Heroku
```

### Installing

Once you have cloned the repo then cd into the directory. From here:

Install dependancies

```
npm install body-parser express knex pg pg-promise
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

```
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

End with an example of getting some data out of the system or using it for a little demo

```
{ comment_id: 1,
  author: 'butter_bridge',
  article_id: 9,
  votes: 17,
  created_at: 2017-11-22T12:36:03.389Z,
  body:
   'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!' }
   ```

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
