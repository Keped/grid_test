import React from 'react';
import { connect, useStore } from 'react-redux';
import Grid from './Grid';

const Trailer = ({ data }) => (
  <a href={ data.Trailer.url }
     target="_blank"
     rel="noopener noreferrer">
    trailer...
  </a>
);
const CustomHeader = ({ columnData }) => (
  <span style={{color:'green'}}>{columnData.title}</span>
);
const config = [
  {
    title: 'id',
    fieldName: 'imdbID'
  },  
  {
    title: 'genre',
    fieldName: 'Genre',
    cellStyle: (rowItem) => rowItem.Genre.indexOf('Drama') == -1 ? {backgroundColor:'orange',color:'red'} : {}
  },
  {
    title: 'title',
    fieldName: 'Title',
    headerStyle: {color:'blue', textTransform:'uppercase'}
  },
  {
    title: 'rating',
    fieldName: 'imdbRating'
  },
 {
   title: 'trailer',
   component: Trailer,
   cellStyle: (rowItem) => rowItem.Genre.indexOf('Drama') == -1 ? {backgroundColor:'orange'} : {},
   headerComponent:CustomHeader
 }
];

const App = ({ data }) => (
 
  <div>
    <Grid config={ config } data={ data } />
  </div>
);

const mapStateToProps = state => ({
  data: state.movies
});

export default connect(mapStateToProps)(App);
