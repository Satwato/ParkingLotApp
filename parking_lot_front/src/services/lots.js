

import axios from 'axios';


const RECIPES_API_BASE_URL = "http://starlord.hackerearth.com/recipe";

class RecipesService {

    getRecipes(){
        return axios.get(RECIPES_API_BASE_URL);
    }
}

export default new RecipesService()

