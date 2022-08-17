import axios from 'axios';
export { fetchImages };

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29263852-decd32d0e53d5fbdcdddbb078';

const fetchImages = async (inputValue, page, perPage) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    console.log(response.data.hits);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
