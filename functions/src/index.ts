'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
const funcWithRegion = functions.region('asia-northeast1');
const usersCollectionRef = admin.firestore().collection('users');

export const registerUserToFirestore = funcWithRegion.auth.user()
  .onCreate(async (user) => {
    await usersCollectionRef.doc(user.uid).create({
      name: user.displayName,
      photoURL: user.photoURL,
    });

    console.log(`A new user with document ID '${user.uid}' was added`);
  });


export const deleteUserFromFirestore = funcWithRegion.auth.user()
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


export const deleteOldPostedContents = funcWithRegion.https
  .onRequest(async (request, response) => {
    if (request.method !== "POST") {
      response.sendStatus(405);
      return;
    }

    if (request.headers.authorization !== `Bearer ${functions.config().api.authorized_token}`) {
      response.sendStatus(401);
      return;
    }

    const snapshot = await admin.firestore().collection('posted-contents')
      .where('postedAt', '<', moment().subtract(1, 'hours').toDate())
      .get();

    if (snapshot.empty) {
      response.send('No contents to be deleted');
      return;
    }

    snapshot.forEach(async oldPostedContent => {
      console.log(`Delete ${oldPostedContent.id}`);
      await oldPostedContent.ref.delete();
    });

    response.send('Old posted contents were deleted');
  });
