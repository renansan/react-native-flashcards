import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeView from './views/Home';
import DeckView from './views/Deck';
import QuizView from './views/Quiz';
import AddDeckView from './views/AddDeck';
import AddCardView from './views/AddCard';

const Stack = {
  Home: {screen: HomeView},
  Deck: {screen: DeckView},
  Quiz: {screen: QuizView},
  AddDeck: {screen: AddDeckView},
  AddCard: {screen: AddCardView},
};

const HeaderNavigator = createStackNavigator(Stack);

/**
 * Navigator
 * @link https://review.udacity.com/#!/rubrics/1215/view
 */
const App = createAppContainer(HeaderNavigator);

export default App;
