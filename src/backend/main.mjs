import express from "express";
import http from 'http';
import { Config } from '../shared-data/server-config.js'
import { CommunicationManager } from "./components/communication-manager.mjs";
import { logger } from './logger/logger.js'

const SERVER_PORT = Config.server.serverPort;

const app = express();
const server = http.createServer(app);
server.listen(SERVER_PORT, () => {
    logger.info(`Server started on port ${SERVER_PORT}`);
});  

const communicationManager = new CommunicationManager(server);
communicationManager.registerEvents();
communicationManager.startListening();












