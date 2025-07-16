// src/socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // Make sure the port matches backend
export default socket;
