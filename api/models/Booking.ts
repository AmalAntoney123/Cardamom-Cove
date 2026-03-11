import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    checkIn: Date;
    checkOut: Date;
    message: string;
    room: 'The Emerald Suite' | 'The Canopy Loft' | 'The Mist Retreat' | 'Full Property' | 'any';
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
            validate: {
                validator: function (this: any, v: string) { return !!v || !!this.phone; },
                message: 'Please provide either an email or a phone number.'
            }
        },
        phone: {
            type: String,
            validate: {
                validator: function (this: any, v: string) { return !!v || !!this.email; },
                message: 'Please provide either an email or a phone number.'
            }
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
            enum: ['The Emerald Suite', 'The Canopy Loft', 'The Mist Retreat', 'Full Property', 'any'],
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
