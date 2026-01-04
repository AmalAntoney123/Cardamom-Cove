import mongoose from 'mongoose';

interface IImage extends mongoose.Document {
    url: string;
    title: string;
    category: 'exterior' | 'interior' | 'dining' | 'nature';
}

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

const ImageModel = (mongoose.models.Image as mongoose.Model<IImage>) || mongoose.model<IImage>('Image', ImageSchema);

export default ImageModel;
