import Vue from "vue";
import Vuex from "vuex";
import getCountryISO2 from "country-iso-3-to-2";
import _ from "lodash";

Vue.use(Vuex);

const vaccination_api =
  "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json";

export default new Vuex.Store({
  state: {
    world: [],
    countries: [],
    isLoading: true
  },
  actions: {
    getCountries({ commit }) {
      fetch(vaccination_api, {
        method: "GET",
        headers: {}
      })
        .then(res => res.json())
        .then(res => {
          // Get 'world' data
          this.state.world = res.OWID_WRL;
          // Remove world and return only countries
          delete res["OWID_WRL"];

          Object.keys(res).map(function(key) {
            getCountryISO2(key)
              ? (res[key].iso = getCountryISO2(key).toLowerCase())
              : (res[key].iso = null);
          });
          commit("SET_COUNTRIES", res);
          this.state.isLoading = false;
        })
        .catch(console.error.bind(console));
    }
  },
  mutations: {
    SET_COUNTRIES(state, countries) {
      state.countries = countries;
    },
    sortCountries(state, sortKey) {
      console.log("running mutation");
      const countries = this.state.countries;
      _.orderBy(countries, sortKey, "desc");
      // countries.sort((a, b) => {
      //   let compare = 0;
      //   if (a[sortKey] > b[sortKey]) {
      //     compare = 1;
      //   } else if (b[sortKey] > a[sortKey]) {
      //     compare = -1;
      //   }
      //   return compare;
      // });
      state.countries = countries;
    }
  },
  getters: {
    countries: state => state.countries
  }
});
