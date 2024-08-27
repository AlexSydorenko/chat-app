import User from '../models/user.model.js';
import Conversation from '../models/conversation.model.js';

export const login = async (req, res) => {
    try {
        const { fullName, email, predefined } = req.body;

        const userData = {
            fullName,
            profilePic: `https://avatar.iran.liara.run/public?username=${fullName}`
        };
        
        if (email) {
            const user = await User.findOne({ email });

            if (user) {
                return res.status(200).json(user);
            }

            userData.email = email;
        }

        if (predefined) userData.predefined = true;

        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json(newUser);

    } catch (error) {
        console.log('Error in login controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const loginUserToChatWith = async (req, res) => {
    try {
        const { fullName, predefined } = req.body;
        const { senderId } = req.params;

        const userData = {
            fullName,
            profilePic: `https://avatar.iran.liara.run/public?username=${fullName}`
        };

        if (predefined) userData.predefined = true;

        const newUser = new User(userData);
        await newUser.save();

        const newConversation = new Conversation({
            participants: [newUser._id, senderId]
        });
        await newConversation.save();

        res.status(201).json({
            ...newUser.toObject(),
            conversationId: newConversation._id
        });

    } catch (error) {
        console.log('Error in loginUserToChatWith controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
    
}
