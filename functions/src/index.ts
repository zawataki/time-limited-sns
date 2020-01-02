import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
const func = functions.region('asia-northeast1');
const usersCollectionRef = admin.firestore().collection('users');

export const registerUserToFirestore = func.auth.user()
  .onCreate(async (user) => {
    await usersCollectionRef.doc(user.uid).create({
      name: user.displayName,
      photoURL: user.photoURL,
    });

    console.log(`A new user with document ID '${user.uid}' was added`);
  });


export const deleteUserFromFirestore = func.auth.user()
  .onDelete(async (user) => {
    const userInRepository = await usersCollectionRef.doc(user.uid).get();

    if (!userInRepository.exists) {
      console.error(new Error(`A user, whose auth was deleted, not found in firestore. ${user}`));
      return;
    }

    console.log(`Delete user ${userInRepository.id} => ${userInRepository.data()}`);
    const writeResult = await userInRepository.ref.delete();
    console.log(`A user with document ID '${userInRepository.id}' was deleted from firestore at ${writeResult.writeTime.toDate()}'`);
  });


export const syncUserInFireStoreWithAuthentication = func.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const updatedUser = change.after.data();
    if (updatedUser === undefined) {
      console.error(`The user after update doesn't exist. UserID: ${context.params.userId}`);
      return;
    }

    admin.auth().updateUser(context.params.userId, {
      displayName: updatedUser.name,
      photoURL: updatedUser.photoURL
    })
      .then(user => {
        console.log("Updated the user in auth. uid: " + user.uid);
      })
      .catch(err => {
        console.error(new Error(`Failed to update the user in auth. ${err}`));
      });
  });
