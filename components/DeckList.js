import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View, FlatList } from 'react-native';
import DeckItem from './DeckItem';
import { DECK_LIST } from '../utils/helpers';

const decklist = [
  {
    key: '1',
    id: 'deck-1',
    title: 'Deck 1',
    cards: [
      {
        question: 'What is React?',
        answer: 'A library for managing user interfaces',
      },
      {
        question: 'Where do you make Ajax requests in React?',
        answer: 'The componentDidMount lifecycle event',
      },
      {
        question: 'Where do you make Ajax requests in React?',
        answer: 'The componentDidMount lifecycle event',
      }
    ]
  },
  {
    key: '2',
    id: 'deck-2',
    title: 'Deck 2',
    cards: [],
  },
]

class DeckList extends Component {
  constructor(props) {
    super(props);

    // https://github.com/react-navigation/react-navigation/issues/922#issuecomment-437782511
    this.updateRenderAfterNavigation = this.props.navigation.addListener('willFocus', () => {
      this.fetchData()
    });
  }

  componentWillUnmount() {
    this.updateRenderAfterNavigation
  }

  state = {
    decklist: {},
  }

  renderDeckItem = (item) => {
    return (
      <DeckItem id={item.id} title={item.title} cardsCount={item.cards.length} navigation={this.props.navigation} />
    )
  }

  fetchData = () => {
    AsyncStorage.getItem(DECK_LIST).then(data => {
      if (data) {
        this.setState({ decklist: JSON.parse(data) });
      } else {
        AsyncStorage.setItem(DECK_LIST, JSON.stringify(decklist)).then(data => {
          AsyncStorage.getItem(DECK_LIST).then(data => {
            this.setState({ decklist: JSON.parse(data) });
          });
        });
      }
    });
  }

  componentDidMount () {
    this.fetchData();
  }

  render() {
    return (
      <View style={{ marginVertical: 5 }}>
        <FlatList
          data={this.state.decklist}
          renderItem={({item}) => this.renderDeckItem(item)}
        />
      </View>
    )
  }
}

export default DeckList;
