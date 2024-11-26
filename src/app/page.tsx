'use client';

import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  link: string;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState<Product[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const q = new URLSearchParams(window.location.search);
    q.set('query', inputValue);
    history.pushState(null, '', `?${q.toString()}`);
    console.log({ newQuery: q.toString() });

    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // get query from url
    const q = new URLSearchParams(window.location.search);
    setSearchTerm(q.get('query') || '');

    if (!searchTerm) {
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/search`, {
      method: 'POST',
      body: JSON.stringify({ query: searchTerm }),
    })
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        console.log(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <h1 className='text-3xl font-bold text-center mb-6 text-green-700'>
        🎄 Christmas Wishlist Finder 🎁
      </h1>

      <form
        onSubmit={handleSearch}
        className='flex items-center mb-6 space-x-2'
      >
        <input
          type='text'
          value={searchTerm}
          onChange={handleInputChange}
          placeholder='Search for a Christmas gift...'
          className='flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
        />
        <button
          type='submit'
          disabled={!searchTerm}
          className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center'
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div className='text-center text-gray-500'>
          Searching for gifts... 🎅
        </div>
      )}

      {error && (
        <div className='text-red-500 text-center'>
          Oops! Something went wrong while searching for gifts.
        </div>
      )}

      {products && products.length > 0 && (
        <div className='overflow-x-auto'>
          <table className='w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead className='bg-green-100'>
              <tr>
                <th className='p-3 text-left'>Image</th>
                <th className='p-3 text-left'>Name</th>
                <th className='p-3 text-right'>Price</th>
                <th className='p-3 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className='border-b hover:bg-green-50 transition-colors'
                >
                  <td className='p-3'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='w-16 h-16 object-cover rounded'
                    />
                  </td>
                  <td className='p-3 font-medium'>{product.name}</td>
                  <td className='p-3 text-right font-bold text-green-700'>
                    ${product.price.toFixed(2)}
                  </td>
                  <td className='p-3 text-center'>
                    <a
                      href={product.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-green-600 hover:underline'
                    >
                      View Gift
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {products && products.length === 0 && (
        <div className='text-center text-gray-500'>
          No gifts found. Try another search! 🤶
        </div>
      )}
    </div>
  );
}
