import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, FlatList, Button, TouchableHighlight, StatusBar, TextInput } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';

/**
 * Database
 */
const decklist = [
  {
    key: '1',
    id: 'deck-1',
    title: 'Deck 1',
    cardsCount: 3,
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
    cardsCount: 0,
    cards: [],
  },
]
const storeData = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}
const fetchData = async (key) => {
  let data = null;
  try {
    data = await AsyncStorage.getItem(key) || null;
  } catch (error) {
    console.log(error.message);
  }
  return data;
}

/**
 * Components
 */
class DeckItem extends Component {
  onPress = (ev) => {
    this.props.navigation.navigate('Deck', {
      deckId: this.props.id,
      deckTitle: this.props.title,
      cardsCount: this.props.cardsCount,
    });
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress}>
        <View>
          <Text>{this.props.title}</Text>
          <Text>{this.props.cardsCount}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class DeckList extends Component {
  state = {
    decklist: {}
  }

  renderDeckItem = (item) => {
    return (
      <DeckItem id={item.id} title={item.title} cardsCount={item.cards.length} navigation={this.props.navigation} />
    )
  }

  componentDidMount () {
    this.setState({ decklist: this.props.decklist });

    // AsyncStorage not working
    // const test = fetchData('DECK_LIST');
    // // debugger;
    // AsyncStorage.setItem('DECK_LIST', JSON.stringify(decklist), error => {
    //   debugger;
    // });
    // AsyncStorage.getItem('DECK_LIST', () => {
    //   debugger;
    // }).then(data => {
    //   console.log(data);
    //   debugger;
    // });
    // AsyncStorage.getAllKeys('DECK_LIST').then(data => {
    //   console.log(data);
    //   debugger;
    // });

    // this.setState({ decklist: AsyncStorage.getItem('DECK_LIST') });
    // AsyncStorage.setItem('DECK_LIST', decklist);

  }

  render() {
    return (
      <FlatList
        data={this.state.decklist}
        renderItem={({item}) => this.renderDeckItem(item)}
      />
    )
  }
}

class Deck extends Component {
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
      deckTitle: this.state.title,
    });
  }

  componentDidMount () {
    const id = this.props.navigation.getParam('deckId');
    const title = this.props.navigation.getParam('deckTitle');
    const cardsCount = this.props.navigation.getParam('cardsCount');
    this.setState({
      id,
      title,
      cardsCount,
    });
  }

  render() {
    return (
      <View>
        <View>
          <Text>{this.state.title}</Text>
          <Text>{this.state.cardsCount} cards</Text>
        </View>
        <View>
          <Button title={'Start Quiz!'} onPress={this.startQuiz} />
          <Button title={'Add Card!'} onPress={this.addCard} />
        </View>
      </View>
    )
  }
}

class Quiz extends Component {

  showAnswer = (ev) => {}

  showQuestion = (ev) => {}

  toggleQA = (ev) => {}

  markAsCorrect = (ev) => {}

  markAsIncorrect = (ev) => {}

  render() {
    return (
      <View>
        <View>
          <Text>2/2</Text>
        </View>
        <View>
          <Text>Question/Answer Title</Text>
          <TouchableHighlight onPress={this.showAnswer}>
            <Text>Show Answer</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.showQuestion}>
            <Text>Show Question</Text>
          </TouchableHighlight>
        </View>
        <View>
          <Button title={'Correct'} onPress={this.markAsCorrect} />
          <Button title={'Incorrect'} onPress={this.markAsIncorrect} />
        </View>
      </View>
    )
  }
}

class AddDeck extends Component {

  onPress = (ev) => {}

  render() {
    return (
      <View>
        <Text>Type the title of the new deck</Text>
        <TextInput
           style={{height: 40, borderColor: 'gray', borderWidth: 1}}
           onChangeText={(text) => 'this.setState({text})'}
           value={'this.state.text'}
         />
       <Button title="Submit" onPress={this.onPress} />
      </View>
    )
  }
}

class AddCard extends Component {
  render() {
    return (
      <View>
        <View>
          <Text>Question</Text>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(text) => 'this.setState({text})'}
             value={'this.state.text'}
           />
        </View>
        <View>
          <Text>Answer</Text>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(text) => 'this.setState({text})'}
             value={'this.state.text'}
           />
        </View>
        <View>
          <Button title="Submit" onPress={ev => {}} />
        </View>
        <View>
          {/* <FormLabel>Name</FormLabel> <FormInput onChangeText={someFunction}/> <FormValidationMessage>{'This field is required'}</FormValidationMessage> */}
        </View>
      </View>
    )
  }
}

/**
 * Views
 */
class HomeView extends Component {

  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <View>
        <StatusBar
          barStyle="light-content"
          backgroundColor="orange"
        />
        <DeckList decklist={decklist} navigation={this.props.navigation} />
        <Button title="Add Deck" onPress={ev => this.props.navigation.navigate('AddDeck')} />
      </View>
    );
  }
}

class DeckView extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('deckTitle'),
    };
  };

  render() {
    return (
      <View>
        <Deck navigation={this.props.navigation} />
      </View>
    );
  }
}

class QuizView extends Component {
  static navigationOptions = {
    title: 'Quiz',
  };

  render() {
    return (
      <View>
        <Quiz navigation={this.props.navigation} />
      </View>
    );
  }
}

class AddDeckView extends Component {
  static navigationOptions = {
    title: 'Add Deck',
  };

  render() {
    return (
      <View>
        <AddDeck navigation={this.props.navigation} />
      </View>
    );
  }
}

class AddCardView extends Component {

  static navigationOptions = ({ navigation }) => {
    deckTitle = navigation.getParam('deckTitle');
    return {
      title: `Add a new card to ${deckTitle}`,
    };
  };

  render() {
    return (
      <View>
        <AddCard navigation={this.props.navigation} />
      </View>
    );
  }
}

/**
 * Navigator
 * @link https://reactnavigation.org/docs/en/navigation-options-resolution.html
 */
const Stack = {
  Home: {screen: HomeView},
  Deck: {screen: DeckView},
  Quiz: {screen: QuizView},
  AddDeck: {screen: AddDeckView},
  AddCard: {screen: AddCardView},
};

const HeaderNavigator = createStackNavigator(Stack);

const StackNav = {
  Home: {screen: HeaderNavigator},
  Deck: {screen: DeckView},
  Quiz: {screen: QuizView},
  AddDeck: {screen: AddDeckView},
  AddCard: {screen: AddCardView},
};

const BottomNavigator = createBottomTabNavigator(Stack);

const MainNavigator = createDrawerNavigator({
  ...Stack,
  Home: {screen: HeaderNavigator},
}, {
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
});

/**
 * Navigator
 * @link https://review.udacity.com/#!/rubrics/1215/view
 */
const App = createAppContainer(MainNavigator);

/**
 * Style
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
