
const HTTPStoreClient = require("olo-store/lib/http-store-client");




module.exports = {
    
    async generateToken (userId) {
        const response = await fetch("/user/token", {
            method: 'post',
            headers: {},
            body: String(userId)
        });

        switch (response.status) {
            case 201:
                let token = await response.text();
                return token;
            default:
                let message = await response.text();
                throw new Error(message);
        }         
    },
    
    async storeToken (token) {
        localStorage.setItem("token", token);
    },
    
    async retrieveToken () {
        const token = localStorage.getItem("token");
        return token || null;        
    },
    
    async verifyToken (token) {
        const response = await fetch("/user/verify", {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
            },            
        });

        switch (response.status) {
            case 200:
                let userId = await response.text();
                return userId;
            default:
                let message = await response.text();
                throw new Error(message);
        }         
    },

    async retrieveUserId () {
        const token = await this.retrieveToken();
        console.log(token);
        console.log('userid:', await this.verifyToken(token));
        return token ? await this.verifyToken(token) : null;
    },
    
    async destroyToken () {
        localStorage.removeItem("token");
    },    
        
    async read (url) {
        const token = await this.retrieveToken();
        var source = await HTTPStoreClient.read(url, token);
        return source;
    },
    
    async write (url, source) {
        const token = await this.retrieveToken();
        await HTTPStoreClient.write(url, source, token);        
    },
    
    async delete (url) {
        const token = await this.retrieveToken();
        await HTTPStoreClient.delete(url, token);                
    }
};
