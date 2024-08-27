import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([ conversation.save(), newMessage.save() ]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.log('Error in getMessages controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAutoResponse = async (req, res) => {
    try {
        const result = await fetch('https://api.quotable.io/random');

        if (!result.ok) return res.status(400).json({ error: `Couldn't get random quote` });

        const data = await result.json();
        const quote = data.content;

        setTimeout(() => {
            res.status(200).json({ quote });
        }, 3000);

    } catch (error) {
        console.log('Error in getAutoResponse controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { message: newMessage } = req.body;

        const message = await Message.findById(messageId);

        if (!message) return res.status(404).json(`Cpuldn't find message with id ${messageId}`);

        message.message = newMessage;

        await message.save();

        res.status(200).json(message);

    } catch (error) {
        console.log('Error in updateMessage controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
