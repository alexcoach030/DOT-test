const API = 'https://front-test.beta.aviasales.ru';

var app = new Vue({
    el: "#app",
    data: {
       tickets: [],
       filtered: [],
       checked: [],
       fastest: false,
       cheapest: true,
    },

    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => this.$refs.error = true)
            },
        },
    })
