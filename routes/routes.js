const express = require('express');
const router = express.Router();

const { Car, Booking } = require('../config/db-config');

// const nodemailer = require('nodemailer');
const transporter = require('../utils/email-transponder');

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/email-confirmation.html'), 'utf-8');
const template = handlebars.compile(htmlTemplate);

// === Routes to enter data ===
// ============================

router.post('/addCar', (req, res) => {
    try {
        const Data = req.body;

        const car = new Car({
            model: Data.model,
            mark: Data.mark,
            type: Data.type,
            year: Data.year,
            seats: Data.seats,
            ac: Data.ac,
            transmission: Data.transmission,
            fuel: Data.fuel,
            price: Data.price,
            image: Data.image,
            licensePlate: Data.licensePlate
        });

        car.save();

        res.status(200).json({ message: 'Successfully added car!'});
    } catch (error) {
        console.error(error);
    }
});

router.post('/addBooking', async (req, res) => {
    try {
        const Data = req.body;

        const car = await Car.findOne({ model: Data.model});
        if (!car) return res.status(401).send("Could not find car");

        const booking = new Booking({
            car: car.id,
            mark: Data.mark,
            model: Data.model,
            pickupPlace: Data.pickupPlace,
            dropoffPlace: Data.dropoffPlace,
            pickupDate: Data.pickupDate,
            dropoffDate: Data.dropoffDate,
            firstName: Data.firstName,
            lastName: Data.lastName,
            phone: Data.phone,
            age: Data.age,
            email: Data.email,
            address: Data.address,
            city: Data.city,
            zipcode: Data.zipcode
        })

        booking.save();

        const mailOptions = {
            from: 'karlembeast12@gmail.com',
            to: Data.email,
            subject: 'Form Submission Confirmation',
            text: `This email hereby confirms that you successfully booked a ${Data.mark} ${Data.model} from ${Data.pickupDate} till ${Data.dropoffDate}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });  
      
        res.status(200).json({ message: 'Successfully added booking!'});
    } catch (error) {
        console.error(error);
    }
});

// === Searching bookings ===
// ==========================

router.post('/booking', async (req, res) => {
    const model = req.body.model;

    try {
        const car = await Car.findOne({ model: model});
        if (!car) return res.status(401).send("Could not find car");

        const Data = req.body;

        console.log(Data);

        const booking = new Booking({
            car: car.id,
            mark: car.mark,
            model: Data.model,
            pickupPlace: Data.pickupPlace,
            dropoffPlace: Data.dropoffPlace,
            pickupDate: Data.pickupDate,
            dropoffDate: Data.dropoffDate
        })

        booking.save();

        console.log('Booking added successfully');
    } catch (error) {
        console.error(error);
    }
});

// === Retrieving Cars ===
// =======================

router.get('/cars', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        let cars = await Car.find();
        console.log('Successfully retrieved all cars');
        res.json({ cars: cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'});
    }
});

// === Retrieving Bookings ===
// =======================

router.get('/bookings', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        let bookings = await Booking.find();
        console.log('Successfully retrieved all cars');
        res.json({ bookings: bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'});
    }
});

router.get('/bookings/available', async (req, res) => {
    const { pickupPlace, dropoffPlace, pickupDate, dropoffDate } = req.query;
  
    try {
      const bookings = await Booking.find({
        pickupPlace,
        dropoffPlace,
        pickupDate: { $lte: new Date(dropoffDate) },
        dropoffDate: { $gte: new Date(pickupDate) },
      });
  
      const bookedCarIds = bookings.map((booking) => booking.car);
  
      const availableCars = await Car.find({ _id: { $nin: bookedCarIds } });
      res.status(200).json({ cars: availableCars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching available cars.' });
    }
  });

module.exports = router;