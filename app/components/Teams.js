import _ from 'lodash';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Modal, Image, Platform } from 'react-native';
import { Spinner, Text, View, Content, Container, Header, Title, Body, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3, Left, Right } from 'native-base';
import ccdmp from "../service/ccdmp";

export default class App extends Component {
	static navigationOptions = {
		title: 'Teams',
	};

	constructor(props) {
		super(props);
		this.state = {
			radio1 : true,
			check1: false,
			modalVisible: false,
			search: 'nativebase',
			selectedItem: undefined,
			results: {
				items: []
			}
		};

		this.actions = {
			goToTeamDetails: (team) => {
				this.props.navigation.navigate('TeamProfile', {
					team,
				});
			}
		}
	}

	setModalVisible(visible, x) {
		this.setState({
			modalVisible: visible,
			selectedItem: x
		});
	}

	toggleCheck() {
		this.setState({
			check1 : !this.state.check1
		})
	}
	componentDidMount() {
		this.getAllTeams();
	}

	getAllTeams = async () => {
		// Set loading to true when the search starts to display a Spinner
		this.setState({
			loading: true
		});

		const data = await ccdmp.getTeams();

		this.setState({
			teams: data.objects,
			loading: false,
		})

		/*var that = this;
		return fetch('https://api.github.com/search/repositories?q='+this.state.search)
			.then((response) => response.json())
			.then((responseJson) => {
				// Store the results in the state variable results and set loading to
				// false to remove the spinner and display the list of repositories
				that.setState({
					results: responseJson,
					loading: false
				});

				return responseJson.Search;
			})
			.catch((error) => {

				that.setState({
					loading: false
				});

				console.error(error);
			});*/
	}

	render() {
		return (
			<Container>
				<Content>
					{this.state.loading? <Spinner /> : <List dataArray={this.state.teams} renderRow={(item) =>
						<ListItem thumbnail onPress={ () => this.actions.goToTeamDetails(item) } >
							<Left>
								<Thumbnail square size={80} source={{uri: _.get(item, 'logo.thumbnails.original')}} />
							</Left>
							<Body>
								<Text>{item.title}</Text>
								<Text style={{fontWeight: '600', color: '#999999'}}>{item.id}</Text>
							</Body>
							<Right>
								<Button transparent onPress={ () => this.actions.goToTeamDetails(item) }>
									<Text>View</Text>
								</Button>
							</Right>
						</ListItem>
					} />}
				</Content>
			</Container>
		);
	}
}
const styles = StyleSheet.create({
	header : {
		marginLeft: -5,
		marginTop: 5,
		marginBottom: (Platform.OS==='ios') ? -7 : 0,
		lineHeight: 24,
		color: '#5357b6'
	},
	modalImage: {
		resizeMode: 'contain',
		height: 200
	},
	bold: {
		fontWeight: '600'
	},
	negativeMargin: {
		marginBottom: -10
	}
});
