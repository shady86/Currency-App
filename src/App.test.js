import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import App, { Search, Button, Table } from './App'

Enzyme.configure({ adapter: new Adapter() })

describe('App', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<App />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<App />
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})

describe('Search', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<Search>Search</Search>, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Search>Search</Search>
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

})

describe('Button', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<Button>Give Me More</Button>, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Button>Give Me More</Button>
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

})

describe('Table', () => {

	const props = {
		list: [
			{
				'table': 'A',
				'currency': 'dolar amerykański',
				'code': 'USD',
				'rates': [
					{
						'no': '164/A/NBP/2018',
						'effectiveDate': '2018-08-24',
						'mid': 3.7014
					}
				],
				'id': 0
			},
			{
				'table': 'A',
				'currency': 'euro',
				'code': 'EUR',
				'rates': [
					{
						'no': '164/A/NBP/2018',
						'effectiveDate': '2018-08-24',
						'mid': 4.2801
					}
				],
				'id': 1
			}
		]
	}

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<Table { ...props } />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('shows two items in list', () => {
		const element = shallow(
			<Table { ...props } />
		)

		expect(element.find('.table-row').length).toBe(2)
	})

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Table { ...props } />
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

})