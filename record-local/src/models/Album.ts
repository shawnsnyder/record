import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRecord {
    _id?: Types.ObjectId;
    recordFrontImage?: string;
    recordBackImage?: string;
}

export interface IAlbum {
    _id: Types.ObjectId;
    title: string;
    artist: string;
    albumFrontCover?: string;
    albumBackCover?: string;
    frontCoverImage?: string;
    backCoverImage?: string;
    records: IRecord[];
    createdAt: Date;
    updatedAt: Date;
}

const RecordSchema: Schema = new Schema({
    recordFrontImage: { type: String },
    recordBackImage: { type: String },
});

const AlbumSchema: Schema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    albumFrontCover: { type: String },
    albumBackCover: { type: String },
    frontCoverImage: { type: String },
    backCoverImage: { type: String },
    records: [RecordSchema],
}, { timestamps: true });

export default mongoose.models.Album || mongoose.model<IAlbum & Document>('Album', AlbumSchema); 