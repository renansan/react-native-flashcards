import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

export const colors = {
  blue: '#007bff',
  green: '#28a745',
  red: '#dc3545',
  white: '#fff',
};

const NOTIFICATION_KEY = 'Flashcards:notifications';
const notification = {
  title: 'It\'s time to practice!',
  body: "👋 don't forget to practice today!",
  ios: {
    sound: true,
  },
  android: {
    sound: true,
    priority: 'high',
    sticky: false,
    vibrate: true,
  }
}

export function clearLocalNotification () {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}
export function setLocalNotification () {
  AsyncStorage.getItem(NOTIFICATION_KEY)
  .then(JSON.parse)
  .then((data) => {
    // debugger;
    if (data === null) {
      const { Notifications, Permissions } = Expo;
      Permissions.askAsync(Permissions.NOTIFICATIONS).then(status => {
          debugger;
          if (status === 'granted') {
            Notifications.cancelAllScheduledNotificationsAsync()

            let tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(20)
            tomorrow.setMintutes(0)

            Notifications.scheduleLocalNotificationsAsync(
              notification,
              {
                time: tomorrow,
                repeat: 'day',
              }
            )

            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
          }
        })
    }
  })
}
