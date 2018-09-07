import React, { Component } from 'react';
import { Spinner, Text, View, Content, Container, Header, Title, Body, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3, Left} from 'native-base';
import ChartView from '../library/react-native-highcharts/App';

const options = {
	global: {
		useUTC: false
	},
	lang: {
		decimalPoint: ',',
		thousandsSep: '.'
	}
};

function buildConf(title) {
	var Highcharts = 'Highcharts';
	var conf = {
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
		},
		title: {
			text: title
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: 'Value'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: title,
			data: [],
		}]
	};

	return conf;
}

class ChartComponent extends Component {
	constructor(props) {
		super(props);

		this.conf = buildConf(this.props.title);
		this.state = {
			data: null,
		};
	}

	componentWillReceiveProps(newProps) {
		if (!newProps) {
			return;
		}

		const { data } = newProps;

		this.setState({
			data,
		});
	}

	render() {
		const { data } = this.state;
		return (
			<View>
			{!data ? <Spinner/> :
				<ChartView style={{height: 300}} config={this.conf} options={options} data={data}></ChartView>
		    }
			</View>
		);
	}
}

export default ChartComponent;
