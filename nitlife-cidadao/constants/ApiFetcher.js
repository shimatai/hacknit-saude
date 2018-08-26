class JsonHalFetcher {

    constructor() {
        this.output = {};
    }

    get(url, token) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? token : ''
            },
            timeout: 60000
        }).then((response) => {
            //console.log('##### ApiFetcher.get', url, response);
            return response.json();
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    getAsync(url, token) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? token : ''
            },
            timeout: 60000
        }).then((response) => {
            //console.log('##### ApiFetcher.getAsync', url, response);
            return response;
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    post(url, params, token) {
        const qs = require('qs');
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token ? token : ''
            },
            timeout: 60000,
            body: qs.stringify(params)
        }).then((response) => {
            //console.log('##### ApiFetcher.post', response);
            return response.bodyUsed || response.ok ? (response._bodyText != ''  ? response.json() : Promise.resolve(response)) : Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    delete(url, params, token) {
        const qs = require('qs');
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token ? token : ''
            },
            timeout: 60000,
            body: qs.stringify(params)
        }).then((response) => {
            //console.log('##### ApiFetcher.post', response);
            return response.bodyUsed || response.ok ? (response._bodyText != ''  ? response.json() : Promise.resolve(response)) : Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    postJson(url, params, token) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? token : ''
            },
            timeout: 60000,
            body: JSON.stringify(params)
        }).then((response) => {
            //console.log('ApiFetcher.postJson', response);
            return response.bodyUsed || response.ok ? (response._bodyText != ''  ? response.json() : Promise.resolve(response)) : Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    getAll(url, node, children) {
        var self = this;

        return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then((response) => {
                    return response.json().then((result) => {
                        //console.log('##### ApiFetcher.result - ' + node, result);

                        let obj = result._embedded ? result._embedded : result;
                        obj.children = {};

                        if (children) {
                            let field = eval('obj.' + node);
                            if (field && field instanceof Array) {
                                for (let i = 0; i < field.length; i++) {

                                    for (let j = 0; j < children.length; j++) {
                                        let _url = eval('obj.' + node + '[' + i + ']._links.' + children[j] + '.href');
                                        //console.log('##### _url - ' + node + '.' + children[j], _url);
                                        let childValue = this.get(_url);
                                        eval('obj.' + node + '[' + i + '].children.' + children[j] + '=' + JSON.stringify(childValue));
                                        eval('self.output.obj' + i + '=' + JSON.stringify(obj));
                                    }
                                }
                            } else {
                                for (let i = 0; i < children.length; i++) {
                                    let childValue = this.get(eval('obj.' + node + '._links.' + children[i] + '.href'));
                                    eval('obj.children.' + children[i] + '=' + JSON.stringify(childValue));
                                    eval('self.output.obj' + i + '=' + JSON.stringify(obj));
                                }
                            }
                        }

                        //console.log('##### ApiFetcher.obj - ' + node, obj);
                        //console.log('##### ApiFetcher.output', self.output);

                        return obj;
                    });
                }).catch((error) => {
                    return error;
                });
    }
}

const ApiFetcher = new JsonHalFetcher();
export default ApiFetcher;