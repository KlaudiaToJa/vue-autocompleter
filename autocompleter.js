Vue.component("v-autocompleter", {
    data: function () {
      return {
        count: 0,
        isActive: 0,
        kontrol: 0,
        autocompleterIsActive: false,
        activeResult: 0,
        cities: window.cities.map((cityData) => {
          cityData.nameLowerCase = cityData.name.toLowerCase();
          
          return cityData;
        }),
        filteredCities: []
      };
    },
    watch: 
    {
      /**
     * value() obserwuje zmianę tekstu w input i w czasie rzeczywistym filtruje wyniki
     */
      value() {
        if (this.autocompleterIsActive) {
            return;
        }
        if (this.value.length === 0) {
            filteredCities = [];
            return;
        }

        let returnedCities = [];
        let searchLowerCase = this.value.toLowerCase();


        /**
        * podczas filtrowania wyników fragment tekstu wpisany w input zostaje pogrubiony
        */
        this.cities.some((cityData) => {
            if (returnedCities.length === 10) {
              return true;
            } else if (!cityData.nameLowerCase.includes(searchLowerCase)) {
              return false;
            }
            returnedCities.push({
                name: cityData.name,
                nameHtml: cityData.nameLowerCase.replace(searchLowerCase, (match) => {
                    return '<span class="bold">' + match + '</span>';
                })
            })
        });
        
        this.filteredCities = returnedCities;
      }
    },
    methods:
    {
      /**
     * podczas kliknięcia przycisku enter na input lub elemencie wyszukiwania, wpisuje tekst w input oraz wywołuje "enter"
     */
      zmiana: function(a)
      {
        if(this.isActive == 0)
        {
          this.isActive = 1;
          this.value = a;
          this.kontrol = 0;
          this.$emit('enter');
          document.activeElement.blur();
        }
      },

      /**
     * kontroluje konieczność wyświetlenia autocompletera
     */
      ustaw: function()
      {
        this.kontrol = 1;
        this.autocompleterIsActive = false;
      },

     /**
     * funkcje strzałek – góra, dół
     */
      strzalka: function(index)
      {
        if (!this.autocompleterIsActive) {
          index = 0;
        } 

        if (index > this.filteredCities.length - 1) {
            index = 0;
        } else if (index < 0) {
            index = this.filteredCities.length - 1;
        }
        
        this.autocompleterIsActive = true;
        this.activeResult = index;
        this.value = this.filteredCities[index].name;
      }
    },
    props: {
        value: {
          type: String,
          default: ""
        },
        options: {
          type: Array,
          default: []
        }
      },
    template: `
    <div>

        <input 
            class="inp"
            type="search" 
            maxlength="2048" 
            title="Szukaj" 
            v-on:click="ustaw()" 
            @keyup.up="strzalka(activeResult - 1)" 
            @keyup.down="strzalka(activeResult + 1)" 
            @keyup.enter="zmiana(value)"
            :value="value"
            @input="$emit('input', $event.target.value)">

            <div class="auto">         
                <div id="autocom" :class="[ value.length != 0 && filteredCities.length != 0 && kontrol == 1 ? 'autocompleter' : 'bez']">
                    <ul class="resultsBox">
                        <li class="pojedynczy" v-for="(city, index) in filteredCities" @click="zmiana(city.name)" :class="{active : autocompleterIsActive && activeResult === index}">
                            <img class="lupaAuto" src="lupa.png">
                            <div class="pojWyn" v-html="city.nameHtml">
                            </div>  
                        </li>
                    </ul>
                </div>
            </div>


    </div>    
    `
  });


