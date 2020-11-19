import httpStatus from 'http-status';
import request from 'supertest';
import { startServer, closeServer } from '../main';
import { User } from '../models';

describe('API TEST', () => {
  let server;

  // 테스트를 수행하기 전, API를 구동
  // supertest 모듈을 사용하여 이 API에 접근하여 테스트함
  beforeAll(async (done) => {
    server = await startServer();
    done();
  });
  // 모든 테스트를 마친 후, API서버를 종료함.
  afterAll(async (done) => {
    await closeServer(server);
    done();
  });

  describe('POST /api/register는', () => {
    describe('성공시 ', () => {
      const givenUsername = 'test-user';
      const givenPassword = 'test-password';

      //테스트 후 cleanup
      afterAll(async (done) => {
        await User.remove({});
        done();
      });

      it('user 객체를 return한다.', (done) => {
        request(server)
          .post('/api/register')
          .send({
            username: givenUsername,
            password: givenPassword,
          })
          .expect(httpStatus.CREATED)
          .then((res) => {
            const { _id, username } = res.body;
            expect.anything(_id);
            expect(username).toBe(givenUsername);
            done();
          });
      });
    });

    describe('실패시 ', () => {
      it('username과 password가 전달되지 않으면 BAD_REQUEST', (done) => {
        request(server)
          .post('/api/register')
          .send({})
          .expect(httpStatus.BAD_REQUEST)
          .end(done);
      });

      describe('username 중복 시 ', () => {
        const givenUsername = 'test-user';
        const givenPassword = 'test-password';

        beforeAll(async (done) => {
          await request(server).post('/api/register').send({
            username: givenUsername,
            password: givenPassword,
          });
          done();
        });
        afterAll(async (done) => {
          await User.remove({});
          done();
        });

        it('CONFLICT', (done) => {
          request(server)
            .post('/api/register')
            .send({ username: givenUsername, password: 'some-other-password' })
            .expect(httpStatus.CONFLICT)
            .end(done);
        });
      });
    });
  });
});
