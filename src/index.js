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
loadMore.style.display = 'none';

const getImages = async () => {
  const inputValue = input.value.trim();

  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    createList(response.data);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );

    console.log(response);
  } catch (error) {
    console.log(error);
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
          <img src="${webformatURL}" alt="${tags}" minwidth="370"  loading="lazy" />
          <div class="info">
          <p class="info-item">
            <b>Likes</b>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${downloads}
          </p>
        </div>
        </a>
  
        
      </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', result);

  // Notiflix.Notify.success(`Hooray! We found ${data?.totalHits} images.`);

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

const loadMoreFn = async () => {
  const img = await getImages(input.value);
  await createList(img);
  page += 1;
};

const onSearch = async event => {
  event.preventDefault();
  loadMore.style.display = 'inline-block';
  gallery.innerHTML = '';
  const img = await getImages(input.value);
  await createList(img);
};

form.addEventListener('submit', onSearch);
loadMore.addEventListener('click', loadMoreFn);
