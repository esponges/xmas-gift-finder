const THUMBNAIL_URL =
  'https://m.media-amazon.com/images/I/81v3B6G3H5L._AC_SL1500_.jpg';

const MOCK_DATA = [
  {
    id: '1',
    name: 'The Lord of the Rings Trilogy',
    link: 'https://www.amazon.com/dp/B0CPTDPNBW',
    price: 25,
    currency: 'USD',
    image: THUMBNAIL_URL,
  },
  {
    id: '2',
    name: 'The Lord of the Rings Trilogy',
    link: 'https://www.walmart.com/ip/The-Lord-of-the-Rings-The-Motion-Picture-Trilogy-Extended-Editions-Remastered-Blu-ray/591579431',
    price: 29.96,
    currency: 'USD',
    image: THUMBNAIL_URL,
  },
  {
    id: '3',
    name: 'The Lord of the Rings Trilogy',
    link: 'https://www.walmart.com/ip/The-Lord-of-the-Rings-The-Motion-Picture-Trilogy-4K-Ultra-HD-Blu-ray/359400160',
    price: 55,
    currency: 'USD',
    image: THUMBNAIL_URL,
  },
];

export async function POST(request: Request) {
  const res = await request.json();

  console.log(res.query);
  return Response.json(MOCK_DATA);
}
