import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { clearLocalNotification, setLocalNotification } from '../utils/helpers';
import DeckList from '../components/DeckList';

/**
 * Home
 */
class HomeView extends Component {
 componentDidMount() {
   // setLocalNotification()
 }

 static navigationOptions = {
   title: 'Home',
 };

 render() {
   return (
     <View style={{
         height: '90%',
       }}>
       <View
         style={{
           display: 'flex',
           flexDirection: 'column',
           flexGrow: 1
         }}>
         <DeckList navigation={this.props.navigation} />
       </View>
       <View style={{ marginVertical: 10, flexGrow: 0 }}>
         <Button title="Add Deck" onPress={ev => this.props.navigation.navigate('AddDeck')} />
       </View>
     </View>
   );
 }
}

export default HomeView;

/**
 * Style
 */
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ccc',
    justifyContent: 'flex-start',
  },
  section: {
    flexGrow: 1
  },
});
