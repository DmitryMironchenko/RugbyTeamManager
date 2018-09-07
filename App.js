import {
	createStackNavigator,
} from 'react-navigation';

import Teams from './app/components/Teams';
import TeamProfile from './app/components/TeamProfile';
import TeamMembers from './app/components/TeamMembers';
import TeamMemberProfile from './app/components/TeamMemberProfile';


const App = createStackNavigator({
	Teams: { screen: Teams },
	TeamProfile: { screen: TeamProfile },
	TeamMembers: { screen: TeamMembers },
	TeamMemberProfile: { screen: TeamMemberProfile },
});

export default App;
