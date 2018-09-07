import React, { Component } from 'react';
import { Spinner, Text, Content, Container, Header, Title, Body, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3} from 'native-base';
import {Platform, StyleSheet, Image, View} from 'react-native';

class TeamProfile extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Team', //navigation.getParam('team', { title: 'Team' }).title,
	});

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};

		this.actions = {
			goToTeamMembers: (team) => {
				this.props.navigation.navigate('TeamMembers', {
					team,
				});
			},
		}
	}

	render() {
		const { navigation } = this.props;
		const team = navigation.getParam('team');

		return (
			<View
				style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				{!team ? <Spinner/> :
					<View style={{
						flex: 1,
						alignItems: 'center',
					}}>
						<Text style={{
							paddingTop: 20,
							height: 70,
							fontSize: 40,
						}}>{team.title}</Text>
						<Image style={{
							resizeMode: 'contain',
							width: 500,
							height: 300,
						}} source={{uri: team.logo.thumbnails.original}}/>
						<Button style={{
							alignSelf: 'center'
						}} onPress={() => {
							this.actions.goToTeamMembers(team);
						}}>
							<Text>Run Session</Text>
						</Button>
					</View>
				}
			</View>
		);
	}
};

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
		height: 400,
		flex: 1,
	},
	bold: {
		fontWeight: '600'
	},
	negativeMargin: {
		marginBottom: -10
	}
});

export default TeamProfile;
