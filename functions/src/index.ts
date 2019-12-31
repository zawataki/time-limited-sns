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


// TODO Call regularly this function from GitHub Actions. See https://help.github.com/ja/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions
export const deleteOldPostedContents = funcWithRegion.https
  .onRequest(async (request, response) => {
    if (request.method !== "POST") {
      response.sendStatus(405);
      return;
    }

    // TODO Authorize request sender
    /* 参考:
      - ヒントとアドバイス  |  Firebase: https://firebase.google.com/docs/functions/tips?hl=ja
      - Call functions via HTTP requests  |  Firebase: https://firebase.google.com/docs/functions/http-events
      - functions-samples/index.js at master · firebase/functions-samples: https://github.com/firebase/functions-samples/blob/master/authenticated-json-api/functions/index.js
      - functions-samples/authorized-https-endpoint at master · firebase/functions-samples: https://github.com/firebase/functions-samples/tree/master/authorized-https-endpoint
      - functions-samples/index.js at master · firebase/functions-samples: https://github.com/firebase/functions-samples/blob/master/quickstarts/time-server/functions/index.js
      - functions-samples/index.js at master · firebase/functions-samples: https://github.com/firebase/functions-samples/blob/master/quickstarts/big-ben/functions/index.js
     */
    const snapshot = await admin.firestore().collection('posted-contents')
      .where('postedAt', '>=', moment().subtract(1, 'hours').toDate())
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
