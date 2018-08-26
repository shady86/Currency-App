import React, { Component, Fragment } from 'react' //eslint-disable-line
import axios from 'axios'
import classNames from 'classnames'
import './App.css'
import ReactTooltip from 'react-tooltip' //eslint-disable-line
import listOfCodes from './data/listOfCodes.js'

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			results: [],
			searchTerm: '',
			index: 0,
			error: false
		}
		this.setData = this.setData.bind(this)
		this.updateData = this.updateData.bind(this)
		this.fetchData = this.fetchData.bind(this)
		this.fetchUpToDateData = this.fetchUpToDateData.bind(this)
		this.onSearchChange = this.onSearchChange.bind(this)
		this.onSearchSubmit = this.onSearchSubmit.bind(this)
		this.onDismiss = this.onDismiss.bind(this)
		this.removeAll = this.removeAll.bind(this)

	}

	setData(result) {
		result.id = this.state.index
		this.setState(prevState => ({
			results: [...prevState.results, result]
		}))
		this.setState({ index: this.state.index + 1 })
	}

	updateData(result, index) {
		result.id = index
		this.setState(prevState => ({
			results: [...prevState.results, result]
		}))
	}

	fetchData(searchTerm) {
		axios(`http://api.nbp.pl/api/exchangerates/rates/a/${searchTerm}/?format=json`)
			.then(result => this.setData(result.data))
			.catch(error => this.setState({ error }))
	}

	fetchUpToDateData() {
		const upToDateResults = this.state.results.slice() 
		this.setState({ results: [] })
    upToDateResults.map((item, index) => { //eslint-disable-line
			axios(`http://api.nbp.pl/api/exchangerates/rates/a/${item.code.toLowerCase()}/?format=json`)
				.then(result => this.updateData(result.data, index))
				.catch(error => this.setState({ error }))
		})
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.fetchUpToDateData()
		}, 60000)
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	onSearchChange(event) {
		this.setState({ searchTerm: event.target.value })
	}

	onSearchSubmit(event) {
		const { searchTerm } = this.state
		this.setState({ error: false })
		this.fetchData(searchTerm)

		event.preventDefault()
	}

	onClickSearch(event) {
		this.setState({ error: false })
		const clickedButton = event.currentTarget.childNodes[0].nodeValue
		this.setState({ searchTerm: clickedButton })
	}

	onDismiss(id) {
		const { results } = this.state
		const isNotId = item => item.id !== id
		const updateResults = results.filter(isNotId)

		this.setState({
			results: updateResults
		})
	}

	removeAll() {
		this.setState({ results: [] })
	}

	render() {
		const {
			searchTerm,
			results,
			error,
		} = this.state
		return (
			<div className="page">
				<h1 className='interactions'>Welcome to your favorite currency exchange rate website &#9786;</h1>
				<h3 className="interactions"> Choose one of this currency to add to your favorite list:
					<div style={{ marginTop: '10px' }}>{listOfCodes.rates.map(item => (
						<Fragment key={item.code}>
							<button 
								className='currencyTiles' 
								onClick={this.onClickSearch.bind(this)} 
								data-tip={item.currency} >{item.code}</button>
							<ReactTooltip type='light' effect='solid' />
						</Fragment>
					))}
					</div>
				</h3>
				<div className="interactions">
					<Search
						value={searchTerm}
						onChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}
					>
            Add
					</Search>
				</div>
				{error
					?
					<div className="interactions">
						<p>Something went wrong.
              Please use codes from above list
						</p>
					</div>
					:
					<Fragment>
						<Table
							list={results || {}}
							onDismiss={this.onDismiss}
						/>
						{results.length > 0 && <Button
							onClick={() => this.removeAll()}
							className="removeButtonList"
							style={{ padding: '3px' }}
						>
              Remove All
						</Button>}
					</Fragment>
				}
			</div>
		)
	}
}

const Table = ({ list, onDismiss }) => (

	<div className="table">
		<h5 className="table-header">
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
				<Sort>
          Code
				</Sort>
			</span>
			<span style={{ width: '10%' }}>
				<Sort>
          Date
				</Sort>
			</span>
			<span style={{ width: '10%' }}>

			</span>
		</h5>
		{list.map(item => (
			<div key={`${item.id}-${item.currency}`} className="table-row">
				<span style={{ width: '40%', padding: '10px' }}>
					{item.currency || ''}
				</span>
				<span style={{ width: '30%', padding: '10px' }}>
					{item && item.rates && item.rates[0].mid} PLN
				</span>
				<span style={{ width: '20%', padding: '10px' }}>
					{item.code || ''}
				</span>
				<span style={{ width: '10%', padding: '10px' }}>
					{item && item.rates && item.rates[0].effectiveDate}
				</span>
				<span style={{ width: '10%', padding: '10px' }}>
					<Button
						onClick={() => onDismiss(item.id)}
						className="removeButtonList"
						style={{ padding: '3px' }}
					>
            Remove
					</Button>
				</span>
			</div>
		))}
	</div>
)

const Search = ({ //eslint-disable-line
	value,
	onChange,
	onSubmit,
	children,
}) =>
	<form onSubmit={onSubmit}>
		<input
			type="text"
			value={value}
			onChange={onChange}
		/>
		<button type="submit" className='addButton'>
			{children}
		</button>
	</form>

const Sort = ({ //eslint-disable-line
	children
}) => {
	const sortClass = classNames(
		'button-inline'
	)

	return (
		<Button
			className={sortClass}
		>
			{children}
		</Button>
	)
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

export {
	Button,
	Table,
	Search
}

export default App