import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
    username: string;
    password: string;
    isModified(path: string): boolean;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
    },
}, {
    timestamps: true,
});

// Pre-save hook to hash password
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
