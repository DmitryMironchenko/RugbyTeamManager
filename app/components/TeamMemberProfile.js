import _ from 'lodash';
import React, { Component } from 'react';
import { Spinner, Text, View, Content, Container, Header, Title, Body, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3, Left, Grid, Col, Row,} from 'native-base';
import { MapView } from 'expo';
import { AnimatedRegion } from 'react-native-maps';
import {Platform, StyleSheet, Image} from 'react-native';
import ccdmp from '../service/ccdmp';
import ChartComponent from './ChartComponent';

const markerImage = require('../assets/marker-icon.png');

export default class TeamMemberProfile extends Component {
	static navigationOptions = {
		title: 'Team Member',
	};

	constructor(props) {
		super(props);

		const { navigation } = this.props;
		const member = navigation.getParam('member');
		const team = navigation.getParam('team');
		const session = navigation.getParam('session');

		this.state = {
			isLoading: true,
			member,
			team,
			session,
			coordinate: new AnimatedRegion({
				latitude: 0,
				longitude: 0,
			}),
		};
	}

	async componentDidMount() {
		const { team: { id: teamId }} = this.state;

		this.syncData();
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	syncData = async () => {
		const { team: { id: teamId }, member: { id: memberId}} = this.state;

		const biometricalData = await ccdmp.getBiometricalDataForPlayer(this.state.session, teamId, memberId);
		const locationData = await ccdmp.getLocationDataForPlayer(memberId);

		const x = (new Date()).getTime();// current time
		const y = biometricalData.heart_rate;

		// conf.series[0].data.push([x, y], true, true);

		this.setState({
			isLoading: false,
			biometricalData,
			locationData,
		});

		this.animate({
			latitude: locationData.objects[0].geometry.coordinates[1],
			longitude: locationData.objects[0].geometry.coordinates[0],
		});

		this.timeout = setTimeout(() => (this.syncData()), 600);
	};

	animate(newCoordinate) {
		const { coordinate } = this.state;
		if (Platform.OS === 'android') {
			if (this.marker) {
				this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
			}
		} else {
			coordinate.timing(newCoordinate).start();
		}
	}

	render() {
		const { isLoading, member, coordinate, biometricalData: { heart_rate, bio_impedance, body_temp, calories_burned, respiration, sp_o2 } = {} } = this.state;
		const latitude = _.get(this.state, 'locationData.objects[0].geometry.coordinates[1]');
		const longitude = _.get(this.state, 'locationData.objects[0].geometry.coordinates[0]');

		return (
			<Container>
				<Content>
					{isLoading || !member ? <Spinner/> :
						<View pointerEvents="none" style={{
							padding: 20,
						}}>
							<View style={{
								flexDirection: 'row',
								paddingBottom: 50,
							}}>
								<Image style={{
									resizeMode: 'contain',
									width: 200,
									height: 200,
								}} source={{ uri: member.profile_picture.thumbnails.original }}  />
								<View style={{
									flexDirection: 'column',
									paddingLeft: 20,
								}}>
									<Text style={{
										fontSize: 30,
									}}>{member.name_japanese}</Text>
									<Text style={{
										fontSize: 30,
										color: '#999999',
									}}>{member.name_english}</Text>
									<Text style={{
										paddingTop: 20,
										color: '#333',
									}}>Heart rate: {Number.parseFloat(heart_rate).toPrecision(4)}</Text>
									<Text style={{ color: '#333' }}>Bio Impedance: {Number.parseFloat(bio_impedance).toPrecision(4)}</Text>
									<Text style={{ color: '#333' }}>Calories Burned: {Number.parseFloat(calories_burned).toPrecision(4)}</Text>
									<Text style={{ color: '#333' }}>Body Temperature: {Number.parseFloat(body_temp).toPrecision(4)}</Text>
								</View>
							</View>
							<MapView
								style={{
									alignSelf: 'stretch',
									height: 600,
									paddingTop: 20,
								}}
								initialRegion={{
									latitude,
									longitude,
									latitudeDelta: 0.002,
									longitudeDelta: 0.001,
								}}
							>
								<MapView.Marker.Animated
									ref={marker => { this.marker = marker; }}
									key={member.id}
									coordinate={coordinate}
									title={member.name_english}
									description={member.field_position}
								>
									<Image
										source={markerImage}
										style={{
											width: 41,
											height: 49,
										}}
									></Image>
								</MapView.Marker.Animated>
							</MapView>
							<View style={{
								flex: 1,
								flexDirection: 'row',
								paddingTop: 50,
							}}>
								<View style={{ flex: 1 }}><ChartComponent title="Heart Rate" data={heart_rate} /></View>
								<View style={{ flex: 1 }}><ChartComponent title="Bio Impedance" data={bio_impedance} /></View>
							</View>

							<View style={{
								flex: 1,
								flexDirection: 'row',
								paddingTop: 50,
							}}>
								<View style={{ flex: 1 }}><ChartComponent title="Calories Burned" data={calories_burned} /></View>
								<View style={{ flex: 1 }}><ChartComponent title="Body Temperature" data={body_temp} /></View>
							</View>
							<View style={{
								flex: 1,
								flexDirection: 'row',
								paddingTop: 50,
							}}>
								<View style={{ flex: 1 }}><ChartComponent title="Respiration" data={respiration} /></View>
								<View style={{ flex: 1 }}><ChartComponent title="Blood Oxygen Saturation" data={sp_o2} /></View>
							</View>
						</View>
					}
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
	profileImage: {
		resizeMode: 'contain',
		height: 200,
	},
	bold: {
		fontWeight: '600'
	},
	negativeMargin: {
		marginBottom: -10
	}
});
