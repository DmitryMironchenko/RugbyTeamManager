import _ from 'lodash';
import React, { Component } from 'react';
import { Spinner, Text, View, Content, Container, Header, Title, Body, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3, Left} from 'native-base';
import {Platform, StyleSheet, Image} from 'react-native';
import ccdmp from '../service/ccdmp';

export default class TeamMembers extends Component {
	static navigationOptions = {
		title: 'Team Members',
	};

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			team: this.props.navigation.getParam('team'),
		};

		this.actions = {
			goToTeamMemberDetails: (member) => this.props.navigation.navigate('TeamMemberProfile', {
				member,
				team: this.state.team,
				session: this.session,
			}),
		}
	}

	async componentDidMount() {
		await this.getMembers(this.state.team);
		this.session = await ccdmp.createSession(this.state.team.id);

		this.syncData();
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	getMembers = async (team) => {
		const members = await ccdmp.getTeamMembers(team.id);

		return new Promise(resolve => {
			this.setState({
				members: members.objects,
			}, () => resolve());
		});
	};

	syncData = async () => {
		const playerIds = this.state.members.map(i => i.id);
		const data = await ccdmp.getBiometricalDataForPlayers(this.session, this.state.team.id, playerIds);

		const mergedData = mergeData(this.state.members, data.objects);

		this.setState({
			isLoading: false,
			members: mergedData,
		});

		this.timeout = setTimeout(() => (this.syncData()), 1000);
	};

	goToTeamMemberDetails = (member) => {
		this.actions.goToTeamMemberDetails(member);
	};

	render() {
		const { isLoading, members } = this.state;

		return (
			<Container>
				<Content>
					{isLoading || !members ? <Spinner/> :
					<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{
						members.map(member => ((
							<Card key={member.id} style={{width: 300, height: 300}}>
								<CardItem button onPress={() => this.goToTeamMemberDetails(member)}>
									<Left>
										<Image style={{width: 120, height: 120}}
											   source={{uri: _.get(member, 'profile_picture.thumbnails.original')}}/>
									</Left>
									<Body>
									<Text>{member.name_english}</Text>
									<Text>{member.name_japanese}</Text>
									<Text>{member.field_position}</Text>
									</Body>
								</CardItem>
								<CardItem button onPress={() => this.goToTeamMemberDetails(member)}>
									<Body>
									<Text>Bio Impedance: <Text style={{ fontWeight: 'bold' }}>{Number.parseFloat(member.bio_impedance).toPrecision(4)}</Text></Text>
									<Text>Body Temp: <Text style={{ fontWeight: 'bold' }}>{Number.parseFloat(member.body_temp).toPrecision(4)}</Text></Text>
									<Text>Cals Burned: <Text style={{ fontWeight: 'bold' }}>{Number.parseFloat(member.calories_burned).toPrecision(4)}</Text></Text>
									<Text>Heart Rate: <Text style={{ fontWeight: 'bold' }}>{Number.parseFloat(member.heart_rate).toPrecision(4)}</Text></Text>
									<Text>Respiration: <Text style={{ fontWeight: 'bold' }}>{Number.parseFloat(member.respiration).toPrecision(4)}</Text></Text>
									<Text>Sp O2: <Text style={{ fontWeight: 'bold' }}>{Number.parseFloat(member.sp_o2).toPrecision(4)}</Text></Text>
									</Body>
								</CardItem>
							</Card>
						)))
						}
					</View>
					}
				</Content>
			</Container>
		);
	}
}

function mergeData(players, data) {
	const dataHash = data.reduce((acc, value) => { acc[value.device_id] = value; return acc; }, {});

	debugger;

	const mergedData = players.map(player => ({ ...player, ...dataHash[player.id] }));

	debugger;

	return mergedData
}
