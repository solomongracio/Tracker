import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});


exports.fcmSend = functions.database.ref('/messages/{userId}/{messageId}').onCreate((snapshot, event) => {

    const message:any = snapshot.toJSON()
    const userId = event.params.userId
    const payload = {
        notification: {
            title: message.title,
            body: message.body,
            icon: "https://placeimg.com/250/250/people"
        }
    };
    console.log(payload)

    admin.database()
        .ref(`/fcmTokens/${userId}`)
        .once('value')
        .then(token => token.val())
        .then(userFcmToken => {
            return admin.messaging().sendToDevice(userFcmToken, payload)
        })
        .then(res => {
            console.log("Sent Successfully", res);
        })
        .catch(err => {
            console.log(err);
        });

});