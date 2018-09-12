import React, { Component } from 'react';
import axios from 'axios';
import Search from '../Search';
import Table from '../Table';
import Button from '../Button';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from '../../constants';

import './App.css';

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      error: null, 
    };
  }

  componentWillUnmount() { this._isMounted = false; }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));

  }

  onDismiss = (id) => () => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  isSearched = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

  render() {
    const { result, searchTerm, error } = this.state;
    const page = (result && result.page) || 0;

    if (!result) { return null; }
    if (error) { return <p>Something went wrong.</p>; }

    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
          Search
        </Search>
        {error ?
          <div className="interactions">
            <p>Something went wrong.</p>
          </div> :
          <Table list={result} onDismiss={this.onDismiss} />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button> </div> 
      </div>
    );
  }
}

export default App;
