'use client';

import React, { useState } from "react";

export default function NewPage() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
    const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
    const [loadingFront, setLoadingFront] = useState(false);
    const [loadingBack, setLoadingBack] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Helper to fetch from Pi and upload to local API
    const takeAndUploadPicture = async (coverType: 'front' | 'back') => {
        if (coverType === 'front') setLoadingFront(true);
        else setLoadingBack(true);
        try {
            // 1. Fetch image from Pi
            const piUrl = 'http://goomba.local:3001/take-picture';
            const response = await fetch(piUrl);
            if (!response.ok) throw new Error('Failed to take picture');
            const blob = await response.blob();

            // 2. Upload to local API
            const formData = new FormData();
            formData.append('file', blob, `${coverType}-cover.jpg`);
            formData.append('coverType', coverType);
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
            if (coverType === 'front') setFrontImageUrl(uploadData.url);
            else setBackImageUrl(uploadData.url);
        } catch (err) {
            alert('Error: ' + err);
        } finally {
            if (coverType === 'front') setLoadingFront(false);
            else setLoadingBack(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        if (!title || !artist) {
            setError('Title and Artist are required.');
            return;
        }
        if (!frontImageUrl || !backImageUrl) {
            setError('Both front and back cover images are required.');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/albums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    artist,
                    frontCoverImage: frontImageUrl,
                    backCoverImage: backImageUrl,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTitle("");
                setArtist("");
                setFrontImageUrl(null);
                setBackImageUrl(null);
            } else {
                setError(data.error || 'Failed to save album.');
            }
        } catch (err) {
            setError('An error occurred while saving the album.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Album</h1>
            {error && <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>}
            {success && <div className="text-green-600 bg-green-100 p-2 rounded">Album saved!</div>}
            <div className="flex flex-col gap-2">
                <label className="font-medium">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="border rounded px-2 py-1"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-medium">Artist</label>
                <input
                    type="text"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    className="border rounded px-2 py-1"
                    required
                />
            </div>
            {/* Album Front Cover Section */}
            <div className="border p-4 rounded">
                <h2 className="text-lg font-semibold mb-2">Album Front Cover</h2>
                <button
                    type="button"
                    onClick={() => takeAndUploadPicture('front')}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={loadingFront}
                >
                    {loadingFront ? 'Taking Front Cover...' : 'Take Front Cover'}
                </button>
                {frontImageUrl && (
                    <img src={frontImageUrl} alt="Front Cover" className="mt-4 max-w-xs border" />
                )}
            </div>
            {/* Album Back Cover Section */}
            <div className="border p-4 rounded">
                <h2 className="text-lg font-semibold mb-2">Album Back Cover</h2>
                <button
                    type="button"
                    onClick={() => takeAndUploadPicture('back')}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    disabled={loadingBack}
                >
                    {loadingBack ? 'Taking Back Cover...' : 'Take Back Cover'}
                </button>
                {backImageUrl && (
                    <img src={backImageUrl} alt="Back Cover" className="mt-4 max-w-xs border" />
                )}
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold mt-4"
                disabled={saving}
            >
                {saving ? 'Saving Album...' : 'Create Album'}
            </button>
        </form>
    );
} 