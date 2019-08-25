import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }


  updateToken(token) {
    this.afAuth.authState.subscribe(user => {
      if (!user) return;
      console.log(user, '=> user')
      const data = { [user.uid]: token }
      this.db.object('fcmTokens/').update(data)
    })
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }


  logout() {
    this.afAuth.auth.signOut();
  }
  
  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload)
    });

  }
}
