import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

const NOTIFICATION_KEY = 'Flashcards:notifications'

export function clearLocalNotification () {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification () {
  return {
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
              createNotification(),
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
