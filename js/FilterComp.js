Vue.component('filters', {
    data(){
        return {
            img: function (carrier,price){
                return `<p class="ticket__price">${price} Р</p>
                        <img class="ticket__image" src="https://pics.avs.io/99/36/${carrier}.png" alt="Авиакомпания ${carrier}">`
            },
            moment: function(date){
                return moment(date).format('HH:mm');
            },
            momentAdd: function (date,duration){
                return moment(date).add(duration,'m').format('HH:mm');
            },
            momentDuration: function (duration){
                let hours = Math.floor(duration/60);
                let minutes = duration-(hours*60);
                return `${hours}ч ${minutes}м`
            },
            stops: function (stops){
                let a = stops.length
                switch (a){
                    case 0:
                        return 'ПЕРЕСАДОК НЕТ';
                    case 1:
                        return '1 ПЕРЕСАДКА';
                    case 2:
                        return '2 ПЕРЕСАДКИ';
                    case 3:
                        return '3 ПЕРЕСАДКИ';
                }
            }
        }
    },
    computed: {
        filt: function (){
            let data = [];
            let filterArr = this.$parent.checked;
            let filter;
            let getFilter = function () {
                if (filterArr.includes('all')||filterArr.length === 0 || filterArr.length === 4) {
                    return filter = '0,1,2,3';
                }else return filter = filterArr.toString();
            }
            getFilter();
            for (item of this.$parent.tickets){
                for (elem of item.tickets){
                    if (filter.includes(`${elem.segments[0].stops.length.toString()}`) && filter.includes(`${elem.segments[1].stops.length.toString()}`)){
                        data.push(elem);
                    }
                }
            }
            if (this.$parent.cheapest){
                data.sort((a,b) =>a.price - b.price);
            }
            if (this.$parent.fastest){
                data.sort((a,b) => (a.segments[0].duration+a.segments[1].duration) - (b.segments[0].duration+b.segments[1].duration));
            }
            return data;
        },
    },
    template: `
                <div>
                     <template v-for="item in filt.slice(0,5)">
                            <div class="ticket">
                                <div class="ticket__header" v-html="img(item.carrier,item.price)"></div>
                                <div class="ticket__content">
                                    <div class="ticket__block">
                                        <p class="ticket__description">{{item.segments[0].origin}} - {{item.segments[0].destination}}</p>
                                        <p class="ticket__information">{{moment(item.segments[0].date)}} - {{momentAdd(item.segments[0].date,item.segments[0].duration)}}</p>
                                    </div>
                                    <div class="ticket__block">
                                        <p class="ticket__description">В ПУТИ</p>
                                        <p class="ticket__information">{{momentDuration(item.segments[0].duration)}}</p>
                                    </div>
                                    <div class="ticket__block">
                                        <p class="ticket__description">{{stops(item.segments[0].stops)}}</p>
                                        <p class="ticket__information">{{item.segments[0].stops.join(', ')}}</p>
                                    </div>
                                </div>
                                <div class="ticket__content">
                                    <div class="ticket__block">
                                        <p class="ticket__description">{{item.segments[1].origin}} - {{item.segments[1].destination}}</p>
                                        <p class="ticket__information">{{moment(item.segments[1].date)}} - {{momentAdd(item.segments[1].date,item.segments[1].duration)}}</p>
                                    </div>
                                    <div class="ticket__block">
                                            <p class="ticket__description">В ПУТИ</p>
                                        <p class="ticket__information">{{momentDuration(item.segments[1].duration)}}</p>
                                    </div>
                                    <div class="ticket__block">
                                        <p class="ticket__description">{{stops(item.segments[1].stops)}}</p>
                                        <p class="ticket__information">{{item.segments[1].stops.join(', ')}}</p>
                                    </div>
                                </div>
                            </div>
                        </template>
                </div>
                `
});

Vue.component('sort',{
    methods: {
        sort: function (event){
            let value = event.target.value;
            if (this.$parent.cheapest === this.$parent.fastest){
                switch (value){
                    case 'cheapest':
                        this.$parent.cheapest = !this.$parent.cheapest;
                        break;
                    case 'fastest':
                        this.$parent.fastest = !this.$parent.fastest;
                        break;
                }
            }else {
                this.$parent.cheapest = !this.$parent.cheapest;
                this.$parent.fastest = !this.$parent.fastest;
            }

        }
    },
    template: `
                <div class="filter__container">
                    <div class="filter__buttons"><button class="filter__button_left" v-bind:class="{ 'filter__button_active':this.$parent.cheapest }" v-on:click="event => sort(event)" value="cheapest">САМЫЙ ДЕШЕВЫЙ</button></div>
                    <div class="filter__buttons"><button class="filter__button_right" v-bind:class="{ 'filter__button_active':this.$parent.fastest }" v-on:click="event => sort(event)" value="fastest">САМЫЙ БЫСТРЫЙ</button></div>
                </div>
              `
})

Vue.component('stops',{
    template:   `
                <div class="stopsContainer">
                    <div class="stops">
                        <h2>КОЛИЧЕСТВО ПЕРЕСАДОК</h2>
                        <form class="stops__filter">
                            <div class="stops__item"><input class="stops__checkbox" type="checkbox" id="all-stops" value="all" v-model="$parent.checked"">
                            <label for="all-stops">Все</label></div>
                            <div class="stops__item"><input class="stops__checkbox" type="checkbox" id="no-stops" value="0" v-model="$parent.checked">
                            <label for="no-stops">Без пересадок</label></div>
                            <div class="stops__item"><input class="stops__checkbox" type="checkbox" id="1-stop" value="1" v-model="$parent.checked">
                            <label for="1-stop">1 пересадка</label></div>
                            <div class="stops__item"><input class="stops__checkbox" type="checkbox" id="2-stop" value="2" v-model="$parent.checked">
                            <label for="2-stop">2 пересадки</label></div>
                            <div class="stops__item"><input class="stops__checkbox" type="checkbox" id="3-stop" value="3" v-model="$parent.checked">
                            <label for="3-stop">3 пересадки</label></div>
                        </form>
                    </div>
                </div>
                `
})
