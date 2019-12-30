import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
const func = functions.region('asia-northeast1');
const usersCollectionRef = admin.firestore().collection('users');

export const registerUserToFirestore = func.auth.user()
  .onCreate(async (user) => {
    const writeResult = await usersCollectionRef.add({
      id: user.uid,
      name: user.displayName,
      photoURL: user.photoURL,
    });

    console.log(`A new user with document ID '${writeResult.id}' was added`);
  });


export const deleteUserFromFirestore = func.auth.user()
  .onDelete(async (user) => {
    const users = await usersCollectionRef.where('id', '==', user.uid)
      .get();

    if (users.empty) {
      console.error('A user, whose auth was deleted, not found in firestore', user);
      return;
    }

    users.forEach(async doc => {
      console.log(`Delete user ${doc.id} => ${doc.data()}`);
      const writeResult = await doc.ref.delete();
      console.log(`A user with document ID '${doc.id}' was deleted from firestore at ${writeResult.writeTime.toDate()}'`);
    });
  });
