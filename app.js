'use strict'

const stateAbbreviations = [
 'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
 'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
 'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
 'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
 'VT','VI','VA','WA','WV','WI','WY'
];
const url = 'https://developer.nps.gov/api/v1/parks';
const apiKey ='RDV2BfeR49gRmz2bhyUTZaHG1wOi3dKSwbo5EqsD';
// const options = {
//     headers: new Headers({
//       "X-Api-Key": apiKey})
//   };
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function getParksByState(state,limit=10){
  const params = {
    stateCode: state,
    limit: limit,
    api_key:apiKey
  };

  const queryString = formatQueryParams(params);
  let urlQuery = url +"?"+queryString;

  fetch(urlQuery)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayParks(responseJson.data))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function displayParks(parksArray){
  parksArray.forEach(park=>{
    $('.parks').append(`
      <li>
      <h3>${park.fullName}</h3>
      <p><a href="${park.url}">Website</a></p>
      <p>${park.description}</p>
      </li>
      `);
  });
}
function handleSubmit(){
  stateAbbreviations.forEach(state =>$('#state-select').append(`<option value="${state}">${state}</option>`));
  $('form').on('submit',event=>{
    event.preventDefault();
    let state = $('#state-select').val();
    let limit = parseInt($('#result-count').val());
    $('.parks').empty();
    getParksByState(state,limit-1);
    $('.results').removeClass('hidden');
  });
}
$(handleSubmit);
