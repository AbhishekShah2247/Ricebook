require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

let cookie;

describe('Validate Profile functionality', () => {

    it('should login user for profile tests', (done) => {
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

    it('should update headline and verify the change', (done) => {
        let headline = {
            headline: "New Headline"
        }
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify(headline)
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res.headline).toBe("New Headline");
            done();
        })
    })

    it('should get headline with username as param', (done) => {
        fetch(url('/headline/testUser'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res.headline).toBe("New Headline");
            done();
        })
    })

    it('should get headline without param', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res).toBeDefined();
            done();
        })
    })
});