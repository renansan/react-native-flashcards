import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  SafeAreaView,
} from 'react-navigation';
// https://reactnavigation.org/docs/en/navigation-options-resolution.html

const decklist = [
  {
    key: '1',
    title: 'Deck 1',
    itemsCount: 3,
  },
  {
    key: '2',
    title: 'Deck 2',
    itemsCount: 0,
  },
]

class DeckItem extends Component {
  onPress = (ev) => {
    this.props.navigation.navigate('Profile');
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress}>
        <View>
          <Text>{this.props.title}</Text>
          <Text>{this.props.itemsCount}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class DeckList extends Component {

  render() {
    return (
      <FlatList
        data={decklist}
        renderItem={({item}) => <DeckItem title={item.title} itemsCount={item.itemsCount} navigation={this.props.navigation} />}
      />
    )
  }
}

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar
          barStyle="light-content"
          backgroundColor="orange"
        />
        <DeckList navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar
          barStyle="light-content"
          backgroundColor="orange"
        />
        <View>
          <Text>Profile</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const BottomNavigator = createBottomTabNavigator(
  {
    Home: {screen: HomeScreen},
    Profile: {screen: ProfileScreen},
  }
);

const HeaderNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Profile: {screen: ProfileScreen},
});

const MainNavigator = createDrawerNavigator(
  {
    Home: {screen: HeaderNavigator},
    Profile: {screen: BottomNavigator},
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const App = createAppContainer(MainNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
