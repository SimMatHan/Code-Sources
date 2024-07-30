import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const requestsCollection = collection(db, "requests");
const usersCollection = collection(db, "users");

export const createRequest = async (request) => {
  await addDoc(requestsCollection, request);
};

export const getRequests = async (recipient) => {
  const q = query(requestsCollection, where("recipient", "==", recipient));
  const querySnapshot = await getDocs(q);
  const requests = querySnapshot.docs.map(doc => doc.data());
  return requests;
};

export const getUsers = async () => {
  const querySnapshot = await getDocs(usersCollection);
  const users = querySnapshot.docs.map(doc => doc.data());
  return users;
};

export const createUser = async (user) => {
  await addDoc(usersCollection, user);
};
