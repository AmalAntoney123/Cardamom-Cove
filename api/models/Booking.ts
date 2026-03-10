import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    checkIn: Date;
    checkOut: Date;
    message: string;
    room: 'The Emerald Suite' | 'The Canopy Loft' | 'The Mist Retreat' | 'any';
    status: 'pending' | 'confirmed' | 'cancelled';
}

const BookingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name.'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email.'],
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number.'],
        },
        checkIn: {
            type: Date,
            required: [true, 'Please provide a check-in date.'],
        },
        checkOut: {
            type: Date,
            required: [true, 'Please provide a check-out date.'],
        },
        message: {
            type: String,
            default: '',
        },
        room: {
            type: String,
            enum: ['The Emerald Suite', 'The Canopy Loft', 'The Mist Retreat', 'any'],
            default: 'any',
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const BookingModel =
    (mongoose.models.Booking as mongoose.Model<IBooking>) ||
    mongoose.model<IBooking>('Booking', BookingSchema);

export default BookingModel;
