import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const { id: userId } = req.params;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).populate("participants").populate("messages");

        if (!conversations) return res.status(200).json([]);

        let usersToChatWith = conversations
            .map(conversation => {
                const user = conversation.participants.find(user => user._id.toString() !== userId);

                return {
                    userInfo: {
                        ...user.toObject(),
                        conversationId: conversation._id
                    },
                    lastMessage:
                        conversation.messages.length > 0 ?
                            conversation.messages[conversation.messages.length - 1] :
                            null
                }
            });

        res.status(200).json(usersToChatWith);

    } catch (error) {
        console.log('Error in getUsersForSidebar controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getPredefinedUsers = async (req, res) => {
    try {
        const predefined = await User.find({ predefined: true });

        if (!predefined || predefined.length === 0) {
            return res.status(404).json({ error: `Couldn't get predefined users to chat with` });
        }

        const conversations = await Conversation.find({
            participants: { $in: predefined.map(user => user._id) }
        }).populate("participants").populate("messages");

        let predefinedUsersData = predefined.map(user => {
            const userConversation = conversations.find(conversation =>
                conversation.participants.some(participant => participant._id.toString() === user._id.toString())
            );

            return {
                userInfo: user,
                lastMessage: userConversation && userConversation.messages.length > 0
                    ? userConversation.messages[userConversation.messages.length - 1]
                    : null
            };
        });

        res.status(200).json(predefinedUsersData);

    } catch (error) {
        console.log('Error in getPredefinedUsers controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateUserFullName = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const { fullName } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: `Couldn't update user's full name. _id: ${userId}` });

        user.fullName = fullName;
        await user.save();

        res.status(200).json(user);

    } catch (error) {
        console.log('Error in updateUserFullName controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
