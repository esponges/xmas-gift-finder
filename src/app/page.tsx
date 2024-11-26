'use client';

import Image from 'next/image';
import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  link: string;
};

// Currency options
const CURRENCIES = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'MXN', label: 'Mexican Peso' },
  { value: 'EUR', label: 'Euro' },
];

// Country options
const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'MX', label: 'Mexico' },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('US');

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

      <form onSubmit={handleSearch} className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <div className='flex-grow relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </span>
            <input
              type='text'
              value={searchTerm}
              onChange={handleInputChange}
              placeholder='Search for a Christmas gift...'
              className='flex-grow pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>

          {/* Currency Select */}
          <div className='flex items-center space-x-2'>
            <span className='text-gray-500'>Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className='px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          {/* Country Select */}
          <div className='flex items-center space-x-2'>
            <span className='text-gray-500'>Store Country:</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              {COUNTRIES.map((countryOption) => (
                <option key={countryOption.value} value={countryOption.value}>
                  {countryOption.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type='submit'
            disabled={!searchTerm}
            className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center'
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && (
        <div className='text-center text-gray-500 mt-6'>
          Searching for gifts... 🎅
        </div>
      )}

      {error && (
        <div className='text-red-500 text-center mt-6'>
          Oops! Something went wrong while searching for gifts.
        </div>
      )}

      {products && products.length > 0 && (
        <div className='overflow-x-auto mt-6'>
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
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className='w-16 h-16 object-cover rounded'
                    />
                  </td>
                  <td className='p-3 font-medium'>{product.name}</td>
                  <td className='p-3 text-right font-bold text-green-700'>
                    {currency} {product.price.toFixed(2)}
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
        <div className='text-center text-gray-500 mt-6'>
          No gifts found. Try another search! 🤶
        </div>
      )}
    </div>
  );
}
