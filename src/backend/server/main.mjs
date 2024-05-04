import express from "express";
import http from 'http';
import { Config } from '../../config/server-config.js'
import { CommunicationManager } from "../communication/communication-manager.mjs";
import { logger } from '../misc/logger.js'

const SERVER_PORT = Config.server.serverPort;

const app = express();
const server = http.createServer(app);
server.listen(SERVER_PORT, () => {
    logger.info(`Server started on port ${SERVER_PORT}`);
});  

const communicationManager = new CommunicationManager(server);
communicationManager.registerEvents();
communicationManager.startListening();












