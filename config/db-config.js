const mongoose = require('mongoose');

require('dotenv').config();
const conn = process.env.DB_STRING;

const connection = mongoose.connect(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// === Car Schema ===
// ==================

const carSchema = new mongoose.Schema({
    model: { type: String, required: true},
    mark: { type: String, required: true },
    type: { type: String, required: true },
    year: { type: Number, required: true },
    seats: { type: Number, required: true },
    ac: { type: Boolean, required: true },
    transmission: { type: String, required: true },
    fuel: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true }
});

const bookingSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    mark: { type: String, required: true },
    model: { type: String, required: true },
    pickupPlace: { type: String, required: true },
    dropoffPlace: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    dropoffDate: { type: Date, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: Number, required: true }
});

const Car = mongoose.model('Car', carSchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {Car, Booking};

