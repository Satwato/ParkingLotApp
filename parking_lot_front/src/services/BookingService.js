import axios from 'axios';
import authHeader from "./auth-header";

const Booking_API_BASE_URL = "http://localhost:8102/parking_lot/api/bookings";

class BookingService {

    getBooking(username){
        return axios.get(Booking_API_BASE_URL+ '/' + username, { headers: authHeader() });
    }

    createBooking(lots){
        return axios.post(Booking_API_BASE_URL, lots,  { headers: authHeader() });
    }


}

export default new BookingService()
