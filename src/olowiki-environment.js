const BrowserEnvironment = require("@onlabsorg/olojs/src/browser-environment");


class OlowikiEnvironment extends BrowserEnvironment {
    
    constructor (origin) {
        super(origin, {
            get Authorization () {
                return self._getAuthorizationHeader();
            }
        });
        const self = this;
    }
    
    _getAuthorizationHeader () {
        return `Bearer ${this.getToken()}`;
    }
    
    getToken () {
        return localStorage.getItem("token");
    }

    setToken (token) {
        localStorage.setItem("token", token);
    }

    async getUser () {
        const token = this.getToken();
        const response = await fetch("/user", {
            method: 'get',
            headers: {
                'Authorization': this._getAuthorizationHeader(),
            }
        });
        if (response.status === 200) {
            let user = await response.json();
            return user.id;        
        } else {
            return "Guest";
        }
    }

    async requestToken (userId) {
        const response = await fetch("/user", {
            method: 'post',
            headers: {},
            body: String(userId)
        });
        
        if (!response.ok) {
            let message = await response.text();
            throw new Error(message);        
        }
    }
}

module.exports = window.olonv = new OlowikiEnvironment(location.origin);
