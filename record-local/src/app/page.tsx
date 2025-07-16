import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import Album, { IAlbum } from '@/models/Album';
import Image from 'next/image';

async function getAlbums(): Promise<IAlbum[]> {
  try {
    await clientPromise;
    const albums = await Album.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(albums));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Home() {
  const albums = await getAlbums();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold text-center flex-grow">My Record Collection</h1>
        <Link href="/new" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Add New Album
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map((album) => (
            <div key={album._id.toString()} className="col-span-1 flex flex-col rounded-lg bg-white text-center shadow">
              <div className="flex flex-1 flex-col p-8">
                <div className="w-full h-40 relative">
                  <Image
                    className="object-cover rounded-md"
                    src={album.albumFrontCover || '/placeholder.png'}
                    alt={`${album.title} front cover`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">{album.title}</h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Artist</dt>
                  <dd className="text-md text-gray-500">{album.artist}</dd>
                </dl>
              </div>
            </div>
          ))}
        </div>
        {albums.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No albums found. Add one to get started!</p>
          </div>
        )}
      </div>
    </main>
  );
}
