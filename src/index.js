import './style.css';
import Notiflix from 'notiflix';
import FetchGallery from './fetchGallery.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const fetchGallery = new FetchGallery();

loadMoreBtn.style.display = 'none';

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', fetchImages);

function onSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const inputValue = form.elements.searchQuery.value.trim();

  fetchGallery.searchQuery = inputValue;

  fetchGallery.resetPage();
  clearList();

  loadMoreBtn.style.display = 'block';

  fetchImages().finally(() => form.reset());
}

async function fetchImages() {
  loadMoreBtn.style.display = 'none';
  try {
    const hits = await fetchGallery.getImg();
    const totalHits = await fetchGallery.getTTotal();

    const markup = await hits.reduce(
      (markup, hit) => createMarkup(hit) + markup,
      ''
    );
    appendImgToList(markup);

    gallerySimpleLightbox.refresh(hits);

    loadMoreBtn.style.display = 'block';
    if (fetchGallery.page - 1 > 1) {
      scroll();
    }
    if (totalHits === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalHits / 40 < fetchGallery.page - 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
    } else if (totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (err) {
    return console.error(err);
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
<a class ="gallary-link" href="${largeImageURL}">
<img class="images" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
<div class="info">
  <p class="info-item">
    <b>Likes:</b>${likes}
  </p>
  <p class="info-item">
    <b>Views:</b> ${views}
  </p>
  <p class="info-item">
    <b>Comments:</b>${comments}
  </p>
  <p class="info-item">
    <b>Downloads</b>${downloads}
  </p>
</div>
</div>`;
}

function appendImgToList(markup) {
  return gallery.insertAdjacentHTML('beforeend', markup);
}

function clearList() {
  gallery.innerHTML = '';
  fetchGallery.resetPage();
  loadMoreBtn.style.display = 'none';
}

let gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',

  captionDelay: 250,
});

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
