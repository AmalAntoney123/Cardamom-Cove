import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please provide a URL for this image.'],
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for this image.'],
    },
    category: {
        type: String,
        required: [true, 'Please specify the category of this image.'],
        enum: ['exterior', 'interior', 'dining', 'nature'],
    },
}, {
    timestamps: true,
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
