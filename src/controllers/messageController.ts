import { Request, Response } from "express";

class MessageController {
  public async createMessage(req: Request, res: Response) {
    try {
      const { conversationId, from, content, replyTo } = req.body;
      const { newMessage, error } = await req.app.locals.database.createMessage(
        conversationId,
        from,
        content,
        replyTo
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(newMessage);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async editMessage(req: Request, res: Response) {
    try {
      const messageId = req.params.id;
      const { content } = req.body;
      const { editedMessage, error } =
        await req.app.locals.database.editMessage(messageId, content);

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(editedMessage);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const messageId = req.params.id;
      const { success, error } = await req.app.locals.database.deleteMessage(
        messageId
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!success) {
        res.status(404).json({ error: "Message not found" }).send();
      } else {
        res
          .status(200)
          .json({ success: true, message: "Message deleted successfully" })
          .send();
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async reactToMessage(req: Request, res: Response) {
    try {
      const messageId = req.params.id;
      const { userId, reaction } = req.body;
      const { updatedMessage, error } =
        await req.app.locals.database.reactToMessage(
          messageId,
          userId,
          reaction
        );

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(updatedMessage);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async getMessageById(req: Request, res: Response) {
    try {
      const messageId = req.params.id;
      const { message, error } = await req.app.locals.database.getMessageById(
        messageId
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!message) {
        res.status(404).json({ error: "Message not found" }).send();
      } else {
        res.status(200).send(message);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }
}

const messageController = new MessageController();
export default  messageController ;

