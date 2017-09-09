﻿var debugViewComponent = new Vue({
    el: "#debug-view-component",
    data: {
        query: parseValues(window.location.search),
        fragment: parseValues(window.location.hash),
        formBody: window.serverInfo.formBody,
        method: window.serverInfo.method
    },
    computed: {
        code: function() { return this.findValue('code'); },
        accessToken: function() { return this.findValue('access_token'); },
        idToken: function() { return this.findValue('id_token'); },
        tokenType: function() { return this.findValue('token_type'); },
        expiresIn: function() { return this.findValue('expires_in'); },
        state: function() { return this.findValue('state'); },
        error: function() { return this.findValue('error'); },
        errorDescription: function() { return this.findValue('error_description'); },
        success: function() {
            return !this.error.exists && !this.errorDescription.exists;
        },
        flow: function() {
            if (this.code.exists) return 'code';
            if (this.accessToken.exists || this.idToken.exists) return 'implicit';
        },
        tokenEndpoint: function() {
            return '/token';
        }, // todo
        clientId: function() {
            return "todo"; // todo
        },
        implicitResponseType: function() {
            return "token"; // todo
        },
    },
    methods: {
        decodeUri: function(s) {
            s = s || '';
            return decodeURIComponent(s.replace(/\+/g, '%20'));
        },
        findValue: function(name) {
            var result = {
                exists: false,
                value: '',
                source: ''
            };
        
            var foundInQuery = findValueInArray(this.query, name);
            if (foundInQuery && foundInQuery.length) {
                result.exists = true;
                result.value = this.decodeUri(foundInQuery);
                result.source = 'query';
            }
        
            var foundInFragment = findValueInArray(this.fragment, name);
            if (foundInFragment && foundInFragment.length) {
                result.exists = true;
                result.value = foundInFragment;
                result.source = 'fragment';
            }
        
            var foundInFormBody = findValueInArray(this.formBody, name);
            if (foundInFormBody && foundInFormBody.length) {
                result.exists = true;
                result.value = this.decodeUri(foundInFormBody);
                result.source = 'form';
            }
        
            return result;
        }
    }
});

function parseValues(source) {
    var result = [];

    var vars = source.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] && pair[0].length) {
            result.push({ name: pair[0], value: pair[1] });
        }
    }

    return result;
}

function findValueInArray(arr, name) {
    if (!arr) return null;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === name) return arr[i].value;
    }

    return null;
}
