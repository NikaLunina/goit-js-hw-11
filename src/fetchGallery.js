
import axios from 'axios';


const ENDPOINT = 'https://pixabay.com/api/';

export default class FetchGallery {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getImg() {
    const URL = `${ENDPOINT}?key=33725877-d5048a8c1b414c12f4e9c329f&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const response = await axios.get(URL);

    this.nextPage();

    return response.data.hits;
  }

  async getTTotal() {
    const URL = `${ENDPOINT}?key=33725877-d5048a8c1b414c12f4e9c329f&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const response = await axios.get(URL);
    return response.data.totalHits;
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
