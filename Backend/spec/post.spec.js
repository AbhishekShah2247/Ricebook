/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

let cookie;

describe('Validate Article functionality', () => {

    it('should login user for article tests', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            expect(cookie).toBeDefined();
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should add a new article', (done) => {
        let articleToAdd = {
            title: "Test title",
            text: "Test body",
        }
        fetch(url('/article'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify(articleToAdd)
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res).toBeDefined();
            done();
        })
    });

    it('should give all the articles for the current user', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => res.json()).then(res => {
            if (res instanceof Array)
                expect(res.length).toBeGreaterThan(0);
            done();
        });
    });

    it('should give all the articles for the given user', (done) => {
        fetch(url('/articles/testUser'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        }).then(res => res.json()).then(res => {
            if (res instanceof Array)
                expect(res.length).toBeGreaterThan(0);
            done();
        });
    });
});
