import {Request, Response} from "express";


const getConversationWithParticipants = async (res : Response,req : Request) => {
    const conversationId = req.params.id;
    let { conversationWithParticipants, error } = await req.app.locals.database.getConversationWithParticipants(conversationId)
    if (error) {
        res.status(500).json({ error }).send()
    }
    else {
        res.status(200).send(conversationWithParticipants)
    }
};

const getAllConversationsForUser = async () => { }

const getConversationById = async () => { };

const createConversation = async () => { };

const addMessageToConversation = async () => { };

const setConversationSeenForUserAndMessage = async () => { };

const deleteConversation = async () => { };

module.exports = {
    getConversationWithParticipants,
    getAllConversationsForUser,
    getConversationById,
    createConversation,
    addMessageToConversation,
    setConversationSeenForUserAndMessage,
    deleteConversation,
};
