import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages, resetPages } from './api-service';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

const lightbox = new SimpleLightbox('.gallery a', {
  captions: false,
});

let searchQuery = '';
const perPage = 40;
let totalPages = 0;

async function onSearch(e) {
  e.preventDefault();

  refs.galleryContainer.innerHTML = '';
  resetPages();
  refs.loadMoreBtn.classList.add('is-hidden');

  searchQuery = e.currentTarget.searchQuery.value.trim();

  const { totalHits, hits } = await fetchImages(searchQuery);
  e.target.reset();
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    renderCards(hits);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    totalPages = Math.ceil(totalHits / perPage);
  }

  if (totalHits > perPage) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
  lightbox.refresh();
}

function createCards(cards) {
  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
            <a class="gallery__link" href="${largeImageURL}">
                <div class="gallery-item">
                    <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes </b>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views </b>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments </b>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads </b>${downloads}
                        </p>
                    </div>
                </div>
            </a>
        `
    )
    .join('');
}

function renderCards(cards) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', createCards(cards));
}

async function onClickLoadMoreBtn() {
  totalPages -= 1;
  const { hits } = await fetchImages(searchQuery);
  renderCards(hits);

  if (totalPages === 1) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
