# ParkingLotApp

This app uses React.Js and Spring Boot to facilatate a parking lot management system. This also features Google Maps API(for displaying the parking lots available and for admins to markers and add new lots) and Razorpay (for payment)
An admin can:
- Add, Remove, Update Parking Lots
A User can 
- Make bookings for specific slots in a parkinglot. If the system detects that all slots have been booked at any point within the time period the User mentionms, then the backend will let the user know that there are no slots available. 

## Missing files from frontend:

The .env.local file is not present in this repo for security reasons. 
Define your own in the root directory of parkingLot_front 


    REACT_APP_MAPS_CODE=<Your google maps api key>
    REACT_APP_RAZOR_PAY_TEST_KEY=<Your razorpay key>       


## Missing files from backend:
The application.yml is removed `parkingLot/parking_lot/src/main/resources/`
Make your own:

    app:
      name: parkingLotApp

    jwt:
      header: Authorization
      expires_in: 3000 # 5 minutes
      mobile_expires_in: 600 # 10 minutes
      secret: <any secret word> # I used queenvictoria

    razorpay:
      apikey: <Your razorpay key>  
      secret: <Your razorpay secret>  

    spring:
      data:
          mongodb:
            database: parking_lot
            host: localhost
            port: 27017

      application:
        name: ParkingLot
      jackson:
        serialization:
          FAIL_ON_EMPTY_BEANS: true

    server:
      port: 8102


      servlet:
        context-path: /parking_lot
