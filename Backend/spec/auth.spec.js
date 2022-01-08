/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate Registration and Login functionality', () => {

    it('should register a new user', (done) => {
        let regUser = {username: 'testUser', password: '123'};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => {
            let cookie = res.headers.get('set-cookie');
            expect(cookie).toBeDefined();
            return res.json();
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should login user', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            let cookie = res.headers.get('set-cookie');
            expect(cookie).toBeDefined();
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should logout user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            let cookie = res.headers.get('set-cookie');
            expect(cookie).toBeNull();
            done();
        });
    });
});
