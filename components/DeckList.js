import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList } from 'react-native';
import DeckItem from './DeckItem';
import Loading from './Loading';
import { fetchData, storeData } from '../utils/api';
import PropTypes from 'prop-types';

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

  state = {
    decklist: {},
    loading: false,
  }

  componentWillUnmount() {
    this.updateRenderAfterNavigation
  }

  renderDeckItem = (item) => {
    return (
      <DeckItem id={item.id} title={item.title} cardsCount={item.cards.length} navigation={this.props.navigation} />
    )
  }

  fetchData = () => {
    this.setState({ loading: true }, () => {
      fetchData(data => {
        if (data) {
          this.setState({ decklist: JSON.parse(data), loading: false });
        } else {
          storeData(decklist, data => {
            this.setState({ decklist: JSON.parse(data), loading: false });
          });
        }
      });
    });
  }

  componentDidMount () {
    this.fetchData();
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    } else {
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
}

DeckList.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default DeckList;
