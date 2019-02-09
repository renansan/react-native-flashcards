import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

/**
 * DeckItem
 */
class DeckItem extends Component {
  state = {
    bounceValue: new Animated.Value(1),
  }

  onPress = (ev) => {
    this.props.navigation.navigate('Deck', {
      deckId: this.props.id,
      deckTitle: this.props.title,
      cardsCount: this.props.cardsCount,
    });
  }

  componentDidMount() {
    const { bounceValue} = this.state;
    Animated.sequence([
      Animated.timing(bounceValue, { duration: 300, toValue: 1.2}),
      Animated.spring(bounceValue, { toValue: 1, friction: 8})
    ]).start()
  }

  render() {
    const { bounceValue } = this.state;
    return (
      <Animated.View style={[{transform: [{scale: bounceValue}]}]}>
        <TouchableHighlight style={styles.card} onPress={this.onPress}>
          <View style={styles.cardBox}>
            <Text style={styles.cardTitle}>{this.props.title}</Text>
            <Text>{`${this.props.cardsCount} cards`}</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    )
  }
}

/**
 * Style
 */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  cardBox: {
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DeckItem;
