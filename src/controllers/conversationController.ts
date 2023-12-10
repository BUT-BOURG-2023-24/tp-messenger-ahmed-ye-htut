import { Request, Response } from "express";

class ConversationController {
  getConversationWithParticipants = async (req: Request, res: Response) => {
    try {
      const conversationId = req.params.id;
      const { conversationWithParticipants, error } =
        await req.app.locals.database.getConversationWithParticipants(
          conversationId
        );

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(conversationWithParticipants);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };

  getAllConversationsForUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id; // Assuming the user ID is part of the request params
      const { allConversationsForUser, error } =
        await req.app.locals.database.getAllConversationsForUser(userId);

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(allConversationsForUser);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };

  getConversationById = async (req: Request, res: Response) => {
    try {
      const conversationId = req.params.id;
      const { conversationById, error } =
        await req.app.locals.database.getConversationById(conversationId);

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!conversationById) {
        res.status(404).json({ error: "Conversation not found" }).send();
      } else {
        res.status(200).send(conversationById);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };

  createConversation = async (req: Request, res: Response) => {
    try {
      const { title, participants } = req.body;
      const { newConversation, error } =
        await req.app.locals.database.createConversation(title, participants);

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(newConversation);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };

  addMessageToConversation = async (req: Request, res: Response) => {
    try {
      const { conversationId, messageId } = req.body;
      const { success, error } =
        await req.app.locals.database.addMessageToConversation(
          conversationId,
          messageId
        );

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!success) {
        res.status(404).json({ error: "Conversation not found" }).send();
      } else {
        res
          .status(200)
          .json({ success: true, message: "Message added to conversation" })
          .send();
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };

  setConversationSeenForUserAndMessage = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { conversationId, userId, messageId } = req.body;
      const { success, error } =
        await req.app.locals.database.setConversationSeenForUserAndMessage(
          conversationId,
          userId,
          messageId
        );

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!success) {
        res.status(404).json({ error: "Conversation not found" }).send();
      } else {
        res
          .status(200)
          .json({
            success: true,
            message: "Conversation seen updated successfully",
          })
          .send();
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };

  deleteConversation = async (req: Request, res: Response) => {
    try {
      const conversationId = req.params.id;
      const { success, error } =
        await req.app.locals.database.deleteConversation(conversationId);

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!success) {
        res.status(404).json({ error: "Conversation not found" }).send();
      } else {
        res
          .status(200)
          .json({ success: true, message: "Conversation deleted successfully" })
          .send();
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  };
}

const conversationController = new ConversationController();
export default conversationController ;
