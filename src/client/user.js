
const queryString = require('query-string');


module.exports = {
    
    getToken () {
        const query = queryString.parse(location.search);
        return query.user ? query.user : localStorage.getItem('token');
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
