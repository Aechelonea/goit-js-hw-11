const API_KEY = '29601284-1fd69e2b170a114e855666584';
const axios = require('axios').default;

export function fetchPictures(query,page) {
  let URL =`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  return axios
    .get(URL)
    .then(response => {
        return response.data
    })
    .catch(error => {
      console.error('error', error);
    });
}
