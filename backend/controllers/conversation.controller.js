import Conversation from "../models/conversation.model.js";

export const deleteConversation = async (req, res) => {
    try {
        const { id: conversationId } = req.params;

        const conversation = await Conversation.deleteOne({ _id: conversationId });

        if (!conversation) return res.status(404).json({ error: `Couldn't delete conversation with id ${conversationId}` });

        res.status(200).json({ message: `Conversation ${conversationId} was successfully deleted` });

    } catch (error) {
        console.log('Error in deleteConversation controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
