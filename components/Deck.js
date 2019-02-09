import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DeckItem from '../components/DeckItem';
import { Button } from '../components/Button';
import { fetchData, storeData } from '../utils/api';
import { colors } from '../utils/helpers';
import PropTypes from 'prop-types';

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

   editDeck = (ev) => {
     this.props.navigation.navigate('AddDeck', {
       deckId: this.state.id,
       deckTitle: this.state.title,
     });
   }

   deleteDeck = () => {
     const removeItem = () => {
       const id = this.props.navigation.getParam('deckId');
       
       fetchData(data => {
         if (data && id) {
           const prevData = JSON.parse(data);
           const newData = prevData.filter(item => item.id !== id);

           storeData(newData, data => {
             this.props.navigation.navigate('Home');
           });
         }
       });
     }

     Alert.alert(
      'Delete Deck',
      'Are you sure you want to delete this deck?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, I want to delete',
          onPress: () => removeItem()},
      ],
    );
   }

   fetchCardsCount = () => {
     fetchData(data => {
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
           <Button disabled={!hasCards} title={'Start Quiz'} onPress={this.startQuiz}>
             <MaterialIcons name={'playlist-play'} size={24} color={colors.white} />
           </Button>
           <Button title={'Add Card'} onPress={this.addCard}>
             <MaterialIcons name={'playlist-add'} size={24} color={colors.white} />
           </Button>
           <Button title={'Edit Deck'} onPress={this.editDeck}>
             <MaterialCommunityIcons name={'square-edit-outline'} size={24} color={colors.white} />
           </Button>
           <Button title={'Delete Deck'} styleType='danger' onPress={this.deleteDeck}>
             <MaterialCommunityIcons name={'trash-can-outline'} size={24} color={colors.white} />
           </Button>
         </View>
       </View>
     )
   }
 }

 Deck.propTypes = {
   navigation: PropTypes.object.isRequired,
 };

export default Deck;
