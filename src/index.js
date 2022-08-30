import { fetchPictures } from './js/fetchPicturesApi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const _ = require('lodash');
const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let currentPage = 1;

async function createGallery(query, page) {
  try {
    const response = await fetchPictures(query, page);
    if (response.hits.length === 0 && response.totalHits > 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (response.totalHits > 0) {
      response.hits.forEach(image => {
        let imageCardElement = `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
          <div class="picture" style="background-image: url('${image.webformatURL}')"></div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${image.likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${image.views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${image.comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${image.downloads}</span>
            </p>
          </div>
        </a>
      </div>
      `;
        gallery.insertAdjacentHTML('beforeend', imageCardElement);
      });
      lightbox.refresh();
      return response.totalHits;
    }
    if (response.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  let searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  createGallery(searchQuery, currentPage).then(totalHits => {
    if (totalHits) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  });
});

window.onscroll = _.debounce(function (ev) {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    ++currentPage;
    createGallery(searchForm.elements.searchQuery.value.trim(), currentPage);
  }
}, 500);
