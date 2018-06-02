
const queryString = require('query-string');


module.exports = {
    
    getToken () {
        const query = queryString.parse(location.search);
        if (query.user) return query.user;
        
        const localStorageToken = localStorage.getItem('token');
        if (localStorageToken) return localStorageToken;
        
        const localStorageQuery = queryString.parse(localStorage.getItem('query'));
        if (localStorageQuery.user) {
            let token = localStorageQuery.user;
            localStorage.setItem('token', token);
            localStorage.removeItem('query');
            return token;
        }
    },
    
    
    async getInfo () {
        const token = this.getToken();
        
        const response = await fetch('/user', {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,            
            }
        });
        if (!response.ok) {
            let err = await response.text();
            throw new Error(err);
        }
        else {
            let user = await response.json();
            return user;
        }
    },
    
    
    signin () {
        localStorage.setItem('callbackURL', location.origin + location.pathname);
        const anchor = document.createElement('a');
        anchor.href = "/auth/google";
        anchor.click();
    },  
    
    
    async signout () {
        const token = this.getToken();
        
        const response = await fetch('/auth/google/revoke', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,            
            }
        });
        if (!response.ok) {
            let err = await response.text();
            throw new Error(err);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('query');
        location.href = location.origin + location.pathname;
    },      
}
