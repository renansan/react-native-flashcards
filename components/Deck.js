import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import DeckItem from '../components/DeckItem';
// import { Button } from '../components/Button';
import { DECK_LIST, colors } from '../utils/helpers';

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
     const id = this.props.navigation.getParam('deckId');
     const title = this.props.navigation.getParam('deckTitle');
     this.fetchCardsCount();
     this.setState({
       id,
       title,
     });
   }

   render() {
     const { id, title, cardsCount } = this.state;
     const hasCards = cardsCount ? true : false;
     return (
       <View>
         <View>
           <DeckItem
             id={id}
             title={title}
             cardsCount={cardsCount}
             navigation={this.props.navigation} />
         </View>
         <View>
           <Button disabled={!hasCards} title={'Start Quiz!'} onPress={this.startQuiz} />
           <Button styles={{ backgroundColor: colors.red }} title={'Add Card!'} onPress={this.addCard} />
         </View>
       </View>
     )
   }
 }

export default Deck;
