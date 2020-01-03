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
      profilePictures: {
        small: user.photoURL,
        middle: user.photoURL?.replace('normal.jpg', '200x200.jpg'),
      },
    });

    console.log(`A new user with document ID '${user.uid}' was added`);
  });


export const deleteUserFromFirestore = func.auth.user()
  .onDelete(async (user) => {
    const userInRepository = await usersCollectionRef.doc(user.uid).get();

    if (!userInRepository.exists) {
      throw new Error(`A user deleted from auth not found in firestore. ${user}`);
    }

    console.log(`Delete user ${userInRepository.id} => ${userInRepository.data()}`);
    const writeResult = await userInRepository.ref.delete();
    console.log(`A user with document ID '${userInRepository.id}' was deleted from firestore at ${writeResult.writeTime.toDate()}'`);
  });


export const syncUserInFireStoreWithAuthentication = func.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const updatedUser = change.after.data();
    if (updatedUser === undefined) {
      throw new Error(`The user after update doesn't exist. UserID: ${userId}`);
    }

    const user = await admin.auth().updateUser(userId, {
      displayName: updatedUser.name,
      photoURL: updatedUser.profilePictures.small
    });
    console.log("Updated the user in auth. uid: " + user.uid);
  });
