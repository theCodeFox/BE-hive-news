process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../db/connection.js');
const app = require('../app.js');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/api', () => {
    describe('/topics', () => {
      it('INVALID METHOD:405', () => request
        .patch('/api/topics')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('Method Not Allowed!');
        }));
      it('GET:200 returns array of topic objects', () => request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics[0]).to.have.keys(
            'slug', 'description',
          );
        }));
      it('ERR:404 if incorrect path used', () => request
        .get('/api/topic')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Sorry, not found...');
        }));
      it('POST:201 returns posted topic object', () => {
        const topic = {
          slug: 'a',
          description: 'b',
        };
        return request
          .post('/api/topics')
          .send(topic)
          .expect(201)
          .then((res) => {
            expect(res.body.topic).to.have.keys(
              'slug', 'description',
            );
          });
      });
      it('ERR:400 if topic doesnt have slug', () => request
        .post('/api/topics')
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Please fill all required fields with correct data');
        }));
      it('ERR:422 if topic slug exists', () => {
        const input = {
          slug: 'cats',
          description: 'Mr.Tiddles',
        };
        return request
          .post('/api/topics')
          .send(input)
          .expect(422)
          .then((res) => {
            expect(res.body.msg).to.equal('Unprocessable Entity - Input Incorrect');
          });
      });
    });
    describe('/articles', () => {
      it('GET:200 returns array of article objs', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles[0]).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count');
        }));
      it('GET:200 filters by author on query', () => request
        .get('/api/articles?author=rogersop')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
        }));
      it('GET:200 returns empty array and total articles 0 if user exists but doesnt have any articles', () => request
        .get('/api/articles?author=nyancat')
        .expect(200)
        .then((res) => {
          expect(res.body).to.eql({ articles: [], total_articles: 0 });
        }));
      it('GET:200 returns empty array and total articles 0 if topic exists but doesnt have any articles', () => request
        .get('/api/articles?topic=middleware')
        .expect(200)
        .then((res) => {
          expect(res.body).to.eql({ articles: [], total_articles: 0 });
        }));
      it('ERR:404 if user queried doenst exist', () => request
        .get('/api/articles?author=a')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Sorry, Not Found');
        }));
      it('ERR:404 if topic queried doenst exist', () => request
        .get('/api/articles?topic=a')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Sorry, Not Found');
        }));
      it('GET:200 filters by topic on query', () => request
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].topic).to.equal('mitch');
        }));
      it('GET:200 uses query sort_by to sort articles by column name - default date ', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].created_at).to.equal('2018-11-15T12:21:54.171Z');
        }));
      it('GET:200 uses query sort_by to sort articles by column name - author', () => request
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
        }));
      it('ERR:404 for invalid sort_by query', () => request
        .get('/api/articles?sort_by=invalid+query')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Sorry, Not Found');
        }));
      it('GET:200 can take multiple queries', () => request
        .get('/api/articles?author=rogersop&topic=cats')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
          expect(res.body.articles[0].topic).to.equal('cats');
        }));
      it('ERR:400 if blank query given', () => request
        .get('/api/articles?sort_by')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Please fill all required fields with correct data');
        }));
      it('GET:200 uses query sort_by to sort articles by column name and can change order from desc to asc', () => request
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('butter_bridge');
        }));
      it('GET:200 returns limit of replies - default 10', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(10);
        }));
      it('GET:200 returns limit of replies', () => request
        .get('/api/articles?limit=5')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(5);
        }));
      it('GET:200 takes query of p so user can pick which page they would like to view - default 1', () => request
        .get('/api/articles?limit=5&p=1')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(5);
          expect(res.body.articles[4].article_id).to.equal(5);
        }));
      it('GET:200 takes query of p so user can pick which page they would like to view', () => request
        .get('/api/articles?limit=5&p=2')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(5);
          expect(res.body.articles[4].article_id).to.equal(10);
        }));
      it('GET:200 returns amount of articles', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.total_articles).to.equal(12);
        }));
      it('POST:201 returns inserted obj with title, body, topic, author', () => {
        const article = {
          title: 'a',
          body: 'a',
          topic: 'cats',
          author: 'rogersop',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(201)
          .then((res) => {
            expect(res.body.article).to.have.all.keys(
              'title', 'body', 'author', 'topic', 'article_id', 'votes', 'created_at',
            );
          });
      });
      describe('/:article_id', () => {
        it('GET:200 returns article by article_id', () => request
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).to.equal(1);
            expect(res.body.article).to.have.keys(
              'article_id', 'body', 'author', 'created_at', 'votes', 'topic', 'comment_count', 'title',
            );
          }));
        it('ERR:404 if article id doesnt exist', () => request
          .get('/api/articles/100')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, Not Found');
          }));
        it('ERR:400 if article id isnt integer', () => request
          .get('/api/articles/a')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields with correct data');
          }));
        it('PATCH:200 returns unchanged article if passed inc votes with no body', () => request
          .patch('/api/articles/1')
          .send({})
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).to.equal(100);
          }));
        it('PATCH:200 updates positive votes using obj with inc_votes key', () => {
          const updateVotes = { inc_votes: 1 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(101);
            });
        });
        it('PATCH:200 updates negative votes using obj with inc_votes key', () => {
          const updateVotes = { inc_votes: -1 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(99);
            });
        });
        it('PATCH:200 updates negative votes using obj with inc_votes key if votes go below 0', () => {
          const updateVotes = { inc_votes: -101 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(-1);
            });
        });
        it('PATCH:200 returns unchanged article if inc votes is not valid', () => {
          const updateVotes = { inc_votes: 'a' };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(100);
            });
        });
        it('DELETE:204 deletes article by article id', () => request
          .delete('/api/articles/1')
          .expect(204));
        it('ERR:404', () => request
          .delete('/api/articles/100')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, article not found...');
          }));
        it('ERR:404', () => request
          .delete('/api/articles/100')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, article not found...');
          }));
        it('ERR:400', () => request
          .delete('/api/articles/a')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields with correct data');
          }));
        it('GET:200 returns comments array for article using article id', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0]).to.have.keys(
              'comment_id', 'votes', 'created_at', 'author', 'body',
            );
          }));
        it('ERR:404 if article id does not exist', () => request
          .get('/api/articles/100/comments')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, Not Found');
          }));
        it('ERR:400 if article id is invalid', () => request
          .get('/api/articles/a/comments')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields with correct data');
          }));
        it('GET:200 uses query sort_by to sort comments by column name - default date ', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].created_at).to.equal('2016-11-22T12:36:03.389Z');
          }));
        it('GET:200 uses query sort_by to sort comments by column name - author', () => request
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].author).to.equal('icellusedkars');
          }));
        it('GET:200 uses query sort_by to sort comments by column name - votes', () => request
          .get('/api/articles/1/comments?sort_by=votes')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].votes).to.equal(100);
          }));
        it('ERR:400 if blank query given', () => request
          .get('/api/articles/1/comments?sort_by')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields with correct data');
          }));
        it('GET:200 uses query sort_by to sort comments by column name and can change order from desc to asc', () => request
          .get('/api/articles/1/comments?sort_by=author&order=asc')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].author).to.equal('butter_bridge');
          }));
        it('GET:200 returns limit of replies - default 10', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(10);
          }));
        it('GET:200 returns limit of replies', () => request
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(5);
          }));
        it('GET:200 takes query of p so user can pick which page they would like to view - default 1', () => request
          .get('/api/articles/1/comments?limit=5&p=1')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(5);
            expect(res.body.comments[4].comment_id).to.equal(6);
          }));
        it('GET:200 takes query of p so user can pick which page they would like to view', () => request
          .get('/api/articles/1/comments?limit=5&p=2')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(5);
            expect(res.body.comments[4].comment_id).to.equal(11);
          }));
        it('GET:200 returns amount of comments', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.total_comments).to.equal(18);
          }));
        it('POST:201 given username & body - returns new comment', () => {
          const input = { author: 'rogersop', body: 'a' };
          return request
            .post('/api/articles/1/comments')
            .send(input)
            .expect(201)
            .then((res) => {
              expect(res.body.comment).to.have.keys(
                'article_id', 'comment_id', 'votes', 'created_at', 'author', 'body',
              );
            });
        });
        it('ERR:400 if not given correct fields', () => {
          const input = { author: 'rogersop' };
          return request
            .post('/api/articles/1/comments')
            .send(input)
            .expect(400)
            .then((res) => {
              expect(res.body.msg).to.equal('Please fill all required fields with correct data');
            });
        });
        it('ERR:422 if article id does not exist', () => {
          const input = { author: 'rogersop', body: 'a' };
          return request
            .post('/api/articles/100/comments')
            .send(input)
            .expect(422)
            .then((res) => {
              expect(res.body.msg).to.equal('Unprocessable Entity - Input Incorrect');
            });
        });
        it('ERR:422 if username doesnt exist', () => {
          const input = { author: 'a', body: 'a' };
          return request
            .post('/api/articles/1/comments')
            .send(input)
            .expect(422)
            .then((res) => {
              expect(res.body.msg).to.equal('Unprocessable Entity - Input Incorrect');
            });
        });
        it('ERR:400 if article id is invalid', () => {
          const input = { author: 'rogersop', body: 'a' };
          return request
            .post('/api/articles/a/comments')
            .send(input)
            .expect(400)
            .then((res) => {
              expect(res.body.msg).to.equal('Please fill all required fields with correct data');
            });
        });
      });
    });
    describe('/comments', () => {
      it('PATCH:200 returns comment if inc votes has no body', () => request
        .patch('/api/comments/1')
        .send({})
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).to.equal(16);
        }));
      it('PATCH:200 returns updated comment with new vote tally using comment id', () => {
        const input = ({ inc_votes: 1 });
        return request
          .patch('/api/comments/1')
          .send(input)
          .expect(200)
          .then((res) => {
            expect(res.body.comment.votes).to.equal(17);
          });
      });
      it('PATCH:200 returns comment with original vote tally using comment id if given empty vote obj', () => request
        .patch('/api/comments/1')
        .send({})
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).to.equal(16);
        }));
      it('ERR:404 if comment id doesnt exist', () => {
        const input = ({ inc_votes: 1 });
        return request
          .patch('/api/comments/100')
          .send(input)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, Not Found');
          });
      });
      it('ERR:400 if comment is invalid', () => {
        const input = ({ inc_votes: 1 });
        return request
          .patch('/api/comments/a')
          .send(input)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields with correct data');
          });
      });
      it('ERR:400 if votes is invalid', () => {
        const input = ({ inc_votes: 'a' });
        return request
          .patch('/api/comments/a')
          .send(input)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields with correct data');
          });
      });
      it('DELETE:204', () => request
        .delete('/api/comments/1')
        .expect(204));
      it('ERR:404 if comment id doesnt exist', () => request
        .delete('/api/comments/100')
        .expect(404)
        .then(res => expect(res.body.msg).to.equal('Sorry, comment not found...')));
    });
    describe('/users', () => {
      it('GET:200 returns array of user objects', () => request
        .get('/api/users')
        .expect(200)
        .then((res) => {
          expect(res.body.users).to.be.an('array');
          expect(res.body.users[0]).to.have.keys(
            'username', 'avatar_url', 'name',
          );
        }));
      it('POST:201 returns object of new user', () => {
        const input = { username: 'a', avatar_url: 'test', name: 'a' };
        return request
          .post('/api/users')
          .send(input)
          .expect(201)
          .then(res => expect(res.body.user.username).to.equal('a'));
      });
      it('ERR:400 if not all fields are given', () => {
        const input = { avatar_url: 'test', name: 'a' };
        return request
          .post('/api/users')
          .send(input)
          .expect(400)
          .then(res => expect(res.body.msg).to.equal('Please fill all required fields with correct data'));
      });
      describe('/:username', () => {
        it('GET:200 returns user object by username', () => request
          .get('/api/users/rogersop')
          .expect(200)
          .then(res => expect(res.body.user.username).to.equal('rogersop')));
        it('ERR:404 if username does not exist', () => request
          .get('/api/users/a')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, User Not Found');
          }));
        describe('/comments', () => {
          it('', () => request
            .get('/api/users/butter_bridge/comments')
            .expect(200)
            .then(res => expect(res.body.comments[0].author).to.equal('butter_bridge')));
        });
      });
    });
  });
  it('GET:200 returns json object of endpoints', () => request
    .get('/api')
    .expect(200)
    .then((res) => {
      expect(res.body.endpoints['/api/topics']).to.have.keys('GET', 'POST');
    }));
});
