// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
// Firebase Analytics requires IndexedDB to work. So set up a fake IndexedDB.
// For more details, see https://github.com/firebase/firebase-js-sdk/issues/2336#issuecomment-550090914
import "fake-indexeddb/auto";
