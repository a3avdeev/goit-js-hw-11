import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29263852-decd32d0e53d5fbdcdddbb078';
let page = 1;
let perPage = 40;

const getImages = async () => {
  const inputValue = input.value.trim();

  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    createList(response.data);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );

    console.log(response);
    console.log(response.data.hits);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const createList = async data => {
  const result = data?.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a class="gallery_item" href="${largeImageURL}">
          <img src="${webformatURL}" width="320" heigth="210" alt="${tags}" loading="lazy" />
          <div class="info">
          <p class="info-item">
            <b>Likes </b> ${likes}
          </p>
          <p class="info-item">
            <b>Views </b> ${views}
          </p>
          <p class="info-item">
            <b>Comments </b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads </b> ${downloads}
          </p>
        </div>
        </a>
  
        
      </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', result);

  const lightboxImg = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  lightboxImg.refresh();

  // const { height: cardHeight } = document
  //   .querySelector('.gallery')
  //   .firstElementChild.getBoundingClientRect();

  // window.scrollBy({
  //   top: cardHeight * 2,
  //   behavior: 'smooth',
  // });
};

const onSearch = async event => {
  event.preventDefault();

  gallery.innerHTML = '';
  const img = await getImages(input.value);
  createList(img);
  loadMore.style.display = 'grid';
};

const loadMoreFn = async response => {
  page += 1;
  const img = await getImages(input.value);
  await createList(img);

  if (response.hits <= perPage) {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
};

form.addEventListener('submit', onSearch);
loadMore.addEventListener('click', loadMoreFn);
