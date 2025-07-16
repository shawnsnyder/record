import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Album from '@/models/Album';
import { IAlbum } from '@/models/Album';

export async function POST(request: NextRequest) {
    try {
        await clientPromise;
        const body: IAlbum = await request.json();

        const newAlbum = new Album({
            title: body.title,
            artist: body.artist,
            albumFrontCover: body.albumFrontCover,
            albumBackCover: body.albumBackCover,
            records: body.records,
        });

        const savedAlbum = await newAlbum.save();

        return NextResponse.json({ success: true, data: savedAlbum });
    } catch (error) {
        console.error('Error creating album:', error);
        let errorMessage = 'Error creating album';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
} 