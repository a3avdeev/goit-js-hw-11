import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
import { handleInfiniteScroll } from './infiniteScroll';

export { createList };
export { loadMoreFn };

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

let page = 1;
let perPage = 40;
let inputValue = 'null';

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
          <img src="${webformatURL}" width="320" heigth="220" alt="${tags}" loading="lazy" />
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

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const onSearch = async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  inputValue = input.value.trim();

  if (inputValue !== '') {
    fetchImages(inputValue, page, perPage)
      .then(data => {
        if (data?.hits.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (data?.hits.length < perPage) {
          gallery.innerHTML = '';
          createList(data);
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        } else {
          gallery.innerHTML = '';
          createList(data);
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
      })
      .catch(error => console.log(error));
  } else {
    Notiflix.Notify.warning('Hey, come on! Need something to input!');
  }
};

const loadMoreFn = async () => {
  page += 1;
  fetchImages(inputValue, page, perPage)
    .then(data => {
      if (data?.hits.length < perPage) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        createList(data);
        removeInfiniteScroll();
      } else {
        createList(data);
      }
    })
    .catch(error => console.log(error));
};

form.addEventListener('submit', onSearch);
window.addEventListener('scroll', handleInfiniteScroll);

const removeInfiniteScroll = () => {
  window.removeEventListener('scroll', handleInfiniteScroll);
};
