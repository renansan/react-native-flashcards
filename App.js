import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
} from 'react-native';

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
        renderItem={
          ({item}) => <DeckItem title={item.title} itemsCount={item.itemsCount} />
        }
      />
    )
  }
}

class App extends Component {
  render() {
    return (
      <View>
        <Text>Open up App.js to start working on your app!</Text>
        <DeckList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
