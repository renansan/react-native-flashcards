import React, { Component } from 'react';
import { AsyncStorage, Animated, Button, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { DECK_LIST } from '../utils/helpers';

/**
 * Deck
 */
 class Deck extends Component {
   constructor(props) {
     super(props);

     // https://github.com/react-navigation/react-navigation/issues/922#issuecomment-437782511
     this.updateRenderAfterNavigation = this.props.navigation.addListener('willFocus', () => {
       this.fetchCardsCount()
     });
   }

   componentWillUnmount() {
     this.updateRenderAfterNavigation;
   }

   state = {
     id: '',
     title: '',
     cardsCount: 0,
     bounceValue: new Animated.Value(1),
   }

   startQuiz = (ev) => {
     this.props.navigation.navigate('Quiz', {
       deckId: this.state.id,
     });
   }

   addCard = (ev) => {
     this.props.navigation.navigate('AddCard', {
       deckId: this.state.id,
       deckTitle: this.state.title,
     });
   }

   fetchCardsCount = () => {
     AsyncStorage.getItem(DECK_LIST).then(data => {
       const id = this.props.navigation.getParam('deckId');
       const cardsCount = JSON.parse(data).filter(item => item.id === id)[0].cards.length;
       this.setState({ cardsCount });
     });
   }

   componentDidMount () {
     const { bounceValue} = this.state;
     const id = this.props.navigation.getParam('deckId');
     const title = this.props.navigation.getParam('deckTitle');
     this.fetchCardsCount();
     this.setState({
       id,
       title,
     });

     Animated.sequence([
       Animated.timing(bounceValue, { duration: 300, toValue: 1.2}),
       Animated.spring(bounceValue, { toValue: 1, friction: 8})
     ]).start()
   }

   render() {
     const { title, cardsCount } = this.state;
     const hasCards = cardsCount ? true : false;
     const { bounceValue} = this.state;
     return (
       <View>
         <Animated.View style={[{transform: [{scale: bounceValue}]}]}>
           <Text>{title}</Text>
           <Text>{cardsCount} cards</Text>
         </Animated.View>
         <View>
           <Button disabled={!hasCards} title={'Start Quiz!'} onPress={this.startQuiz} />
           <Button title={'Add Card!'} onPress={this.addCard} />
         </View>
       </View>
     )
   }
 }

export default Deck;
