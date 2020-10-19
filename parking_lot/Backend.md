# Models

## ParkingLot
- String id 
- String geocode 
- String address
- long slots
- float lat
- float lng

## UserRoleName
- ROLE_USER
- ROLE_ADMIN 

## Authority
- String id
- UserRoleName name

## Users
- String id 
- String username
- String email 
- String password 
- boolean enabled (not implemented)
- Timestamp lastPasswordResetDate (not implemented)
- List \<Authority> authorities 

## Booking
- String id
- long starttime
- long endtime
- String geocode
- String username
- String type
- String payment_id
- String order_id
- String signature


# Controllers

## Authetication Controller
- [POST] : '/auth/login'
- [POST] : '/auth/signup'
- [POST] : '/auth/refresh' (not Tested)
- [POST] : '/auth/change-password' (not Tested)

## Booking Controller
- [ET]: '/api/bookings/{username}'
- [POST] :'/api/bookings'

## lot Controller
- [GET]: '/api/lots'
- [GET]: '/api/lots/{id}'
- [POST]: '/api/lots'
- [PUT]: '/api/lots/{id}'

## User Controller