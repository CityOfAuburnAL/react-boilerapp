import ability, { defineAbilitiesFor } from '../helpers/ability';

export const userService = {
    login,
    logout
};

function login() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };
    
    return fetch(`https://api2.auburnalabama.org/me`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response... we're not using jwt
            localStorage.setItem('user', JSON.stringify(user));
            //add abilities
            ability.update(defineAbilitiesFor(user));

            return user;
        })
        .catch(handleNoResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    ability.update([]);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // Don't try to redirect to auth server while offline, else user will have a bad time
                if (navigator.onLine) {
                    // Don't try to redirect to auth server while offline, else user will have a bad time
                    let redirect = window.location.href
                    window.localStorage.setItem('redirect', window.location.hash.substring(1))
                    window.location.href = `https://api2.auburnalabama.org/login?redirect=${redirect}`
                }
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function handleNoResponse(error) {
    //just assume all errors here are for not authorized
    if (navigator.onLine) {
        // Don't try to redirect to auth server while offline, else user will have a bad time
        let redirect = window.location.href
        window.localStorage.setItem('redirect', window.location.hash.substring(1))
        window.location.href = `https://api2.auburnalabama.org/login?redirect=${redirect}`
    }
} 