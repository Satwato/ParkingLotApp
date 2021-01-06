



import axios from 'axios';
import authHeader from './auth-header'

const LOTS_API_BASE_URL = "http://localhost:8102/parking_lot/api/lots";

class LotsService {

    getLots(){
        return axios.get(LOTS_API_BASE_URL, {headers: authHeader()});
    }

    createLots(lot){
        return axios.post(LOTS_API_BASE_URL, lot, {headers:(authHeader())});
    }

    getLotsById(lotId){
        return axios.get(LOTS_API_BASE_URL + '/' + lotId, {headers:(authHeader())});
    }

    updateLots(lot, lotId){
        return axios.put(LOTS_API_BASE_URL + '/' + lotId, lot, {headers:(authHeader())});
    }

    deleteLots(lotId){
        return axios.delete(LOTS_API_BASE_URL + '/' + lotId, {headers:(authHeader())});
    }
}

export default new LotsService()

