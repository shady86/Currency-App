import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import './App.css';


const listOfCodes = 
      {
        "table": "A",
        "no": "162/A/NBP/2018",
        "effectiveDate": "2018-08-22",
        "rates": [
          {
            "currency": "bat (Tajlandia)",
            "code": "THB",
            "mid": 0.1132
          },
          {
            "currency": "dolar amerykański",
            "code": "USD",
            "mid": 3.7104
          },
          {
            "currency": "dolar australijski",
            "code": "AUD",
            "mid": 2.7254
          },
          {
            "currency": "dolar Hongkongu",
            "code": "HKD",
            "mid": 0.4726
          },
          {
            "currency": "dolar kanadyjski",
            "code": "CAD",
            "mid": 2.8485
          },
          {
            "currency": "dolar nowozelandzki",
            "code": "NZD",
            "mid": 2.481
          },
          {
            "currency": "dolar singapurski",
            "code": "SGD",
            "mid": 2.714
          },
          {
            "currency": "euro",
            "code": "EUR",
            "mid": 4.2937
          },
          {
            "currency": "forint (Węgry)",
            "code": "HUF",
            "mid": 0.013297
          },
          {
            "currency": "frank szwajcarski",
            "code": "CHF",
            "mid": 3.7705
          },
          {
            "currency": "funt szterling",
            "code": "GBP",
            "mid": 4.7798
          },
          {
            "currency": "hrywna (Ukraina)",
            "code": "UAH",
            "mid": 0.1331
          },
          {
            "currency": "jen (Japonia)",
            "code": "JPY",
            "mid": 0.033604
          },
          {
            "currency": "korona czeska",
            "code": "CZK",
            "mid": 0.1669
          },
          {
            "currency": "korona duńska",
            "code": "DKK",
            "mid": 0.5757
          },
          {
            "currency": "korona islandzka",
            "code": "ISK",
            "mid": 0.034571
          },
          {
            "currency": "korona norweska",
            "code": "NOK",
            "mid": 0.4421
          },
          {
            "currency": "korona szwedzka",
            "code": "SEK",
            "mid": 0.408
          },
          {
            "currency": "kuna (Chorwacja)",
            "code": "HRK",
            "mid": 0.5784
          },
          {
            "currency": "lej rumuński",
            "code": "RON",
            "mid": 0.925
          },
          {
            "currency": "lew (Bułgaria)",
            "code": "BGN",
            "mid": 2.1954
          },
          {
            "currency": "lira turecka",
            "code": "TRY",
            "mid": 0.6092
          },
          {
            "currency": "nowy izraelski szekel",
            "code": "ILS",
            "mid": 1.0184
          },
          {
            "currency": "peso chilijskie",
            "code": "CLP",
            "mid": 0.005588
          },
          {
            "currency": "peso meksykańskie",
            "code": "MXN",
            "mid": 0.196
          },
          {
            "currency": "piso filipińskie",
            "code": "PHP",
            "mid": 0.0694
          },
          {
            "currency": "rand (Republika Południowej Afryki)",
            "code": "ZAR",
            "mid": 0.2578
          },
          {
            "currency": "real (Brazylia)",
            "code": "BRL",
            "mid": 0.9162
          },
          {
            "currency": "ringgit (Malezja)",
            "code": "MYR",
            "mid": 0.9055
          },
          {
            "currency": "rubel rosyjski",
            "code": "RUB",
            "mid": 0.0549
          },
          {
            "currency": "rupia indonezyjska",
            "code": "IDR",
            "mid": 0.00025449
          },
          {
            "currency": "rupia indyjska",
            "code": "INR",
            "mid": 0.05313
          },
          {
            "currency": "won południowokoreański",
            "code": "KRW",
            "mid": 0.003315
          },
          {
            "currency": "yuan renminbi (Chiny)",
            "code": "CNY",
            "mid": 0.5419
          },
          {
            "currency": "SDR (MFW)",
            "code": "XDR",
            "mid": 5.2081
          }
        ]
      }


class App extends Component {
  
  constructor(props) {
    super(props);
    const listOfCurrency = []
    this.state = {
      results: [],
      upToDateResults: [],
      searchKey: '',
      searchTerm: '',
      error: null,
      isLoading: false,
      index: 0
    };
    this.setData = this.setData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchUpToDateData = this.fetchUpToDateData.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.removeAll = this.removeAll.bind(this);

  }

  setData(result) {
    result.id = this.state.index
    this.state.results.push(result)
    this.setState( { isLoading: false });
    this.setState( { index: this.state.index + 1 });
  }

  updateData(result, index) {
    result.id = index
    this.state.results.push(result)
    this.setState( { isLoading: false });
  }

  fetchData(searchTerm) {
    this.setState({ isLoading: true });
    axios(`http://api.nbp.pl/api/exchangerates/rates/a/${searchTerm}/?format=json`)
      .then(result => this.setData(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  fetchUpToDateData() {
    this.setState({ isLoading: true });
    this.setState( { upToDateResults: this.state.results.slice() });
    this.setState( { results: [] });
    this.state.upToDateResults.map((item, index) => {
      axios(`http://api.nbp.pl/api/exchangerates/rates/a/${item.code.toLowerCase()}/?format=json`)
      .then(result => this.updateData(result.data, index))
      .catch(error => this.setState({ error }));
    })
    
  }

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    // this.interval = setInterval(() => {
    //   this.fetchUpToDateData()
    // }, 10000);
  }



  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    this.setState({ error: false})
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchData(searchTerm);
    
    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const isNotId = item => item.id !== id;
    const updateResults = results.filter(isNotId);

    this.setState({
      results: updateResults
    });
  }

  removeAll() {
    this.setState({ results: [] })
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading
    } = this.state;
 
    return (
      <div className="page">
      <p className="interactions"> Please use one of this codes: 
      {listOfCodes.rates.map(item => (
        <span>{item.code}, </span>
      ))} 
      </p>
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            removeAll={this.removeAll}
          >
            Add
          </Search>
        </div>
        { error
          ? <div className="interactions">
            <p>Something went wrong.
              Please use codes from above list
            </p>
            </div>
          : <Table
            list={results || {}}
            onDismiss={this.onDismiss}
          />
        }
       
      </div>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children,
  removeAll
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
    <Button
              onClick={() => removeAll()}
              className="interactions"
              style={{ padding: '3px' }}
            >
              Remove All
            </Button>
  </form>

const Table = ({ list, onDismiss }) => (

      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort>
              Currency
            </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort>
              Exchange rate 
            </Sort>
          </span>
          <span style={{ width: '20%' }}>
            <Sort
            >
              Code
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
          
            >
              Date
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
        
          </span>
        </div>
        {list.map(item => (
          <div key={item.currency || ''} className="table-row">
          <span style={{ width: '40%' }}>
            {item.currency || ''}
          </span>
          <span style={{ width: '30%' }}>
            {item && item.rates && item.rates[0].mid || ''} PLN
          </span>
          <span style={{ width: '20%' }}>
            {item.code || ''}
          </span>
          <span style={{ width: '10%' }}>
            {item && item.rates && item.rates[0].effectiveDate || ''}
          </span>
          <span style={{ width: '10%' }}>
            <Button
              onClick={() => onDismiss(item.id)}
              className="interactions"
              style={{ padding: '3px'}}
            >
              Remove
            </Button>
          </span>
        </div>
        ))}
      </div>
    );

const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  children
}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}

const Button = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const Loading = () =>
  <div>Loading ...</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

export {
  Button,
  Search,
  Table,
};

export default App;