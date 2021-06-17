Vue.component('tickets', {
    data(){
        return {
            error: false,
            searchId: '',
        }
    },
    mounted(){
        this.$parent.getJson(`${API}/search`)
            .then(data => {
                this.searchId = data.searchId;
                this.$parent.getJson(`${API}/tickets?searchId=${this.searchId}`)
                    .then(data =>{
                        if (data !== true) {
                            this.$parent.tickets.push(data);
                        }
                        if (this.error === true && this.$parent.tickets[this.$parent.tickets.length!==0]){
                            this.$parent.tickets[this.$parent.tickets.length-1].stop = false;
                        }
                    })
                    .then(data =>{
                        if (this.$parent.tickets.length === 0) this.getTickets();
                        if (this.$parent.tickets[this.$parent.tickets.length-1].stop === false || this.error === true){
                            this.error = false;
                            this.getTickets();
                        }
                    })
            })
    },
    methods: {
        getTickets(){
            this.$parent.getJson(`${API}/tickets?searchId=${this.searchId}`)
                .then(data =>{
                    if (data !== true) {
                        this.$parent.tickets.push (data);
                    }
                    if (this.error === true && this.$parent.tickets[this.$parent.tickets.length!==0]){
                        this.$parent.tickets[this.$parent.tickets.length-1].stop = false;
                    }
                })
                .then(data =>{
                    if (this.$parent.tickets[this.$parent.tickets.length] === 0) this.getTickets();
                    if (this.$parent.tickets[this.$parent.tickets.length-1].stop === false || this.error === true){
                        this.error = false;
                        this.tickets = this.$parent.tickets;
                        this.getTickets();
                        tickets = this.tickets;
                    }
                })
        },
    },
    template:`<div></div>`
});


