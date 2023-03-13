import axios from 'axios';
export { fetchImages, resetPages };

axios.defaults.baseURL = 'https://pixabay.com/api/';

let page = 1;

async function fetchImages(searchText) {
  const optionParam = new URLSearchParams({
    key: '34167807-b9e11592f4fcc07af941c7191',
    q: searchText,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  const { data } = await axios.get(`?${optionParam}`);
  page += 1;
  return data;
}

function resetPages() {
  page = 1;
}
