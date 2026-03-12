const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const sendMessage = async (req, res) => {
    const { receiverId, content, messageType = 'text' } = req.body;

    const senderId = req.user._id;

    const receiverExist = User.findById(receiverId);

    if (!exist) {
        return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType
    })

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
        const unreadMap = new Map();
        unreadMap.set(receiverId.toString(), 1);
        unreadMap.set(senderId.toString(), 0);

        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            lastMessages: message._id,
            unreadCounts: unreadMap
        })

    }

    else {
        const currentUnreadCount = conversation.unreadCounts.get(receiverId.toString()) || 0;

        conversation.unreadCounts.set(receiverId.toString(), currentUnreadCount + 1);
        conversation.lastMessages = message._id;
        await conversation.save();
    }

    await message.populate('sender', 'name email avatar');

    res.status(201).json({
        success: true,
        message: {
            _id: message._id,
            sender: message.sender,
            receiver: message.receiver,
            content: message.content,
            messageType: message.messageType,
            readStatus: message.readStatus,
            deliveredStatus: message.deliveredStatus,
            createdAt: message.createdAt
        },
        conversationId: conversation._id
    });
}

const getChatHistory = async (req, res) => {
    try {
        const {userId} = req.params;
        const currentUserId = req.user._id;

        const message=await Message.find({
            $or:[
                {sender:currentUserId,receiver:userId},
                {sender:userId,receiver:currentUserId}
            ]
        }).sort({createdAt:-1}).populate('sender','name email avatar').populate('receiver','name email avatar');

        await Message.updateMany({
            sender:userId,
            receiver:currentUserId,
            readStatus:false
        },{readStatus:true})

        const conversation=await Conversation.findOne({
            participants:{$all:[currentUserId,userId]}
        })

        if(conversation){
            conversation.unreadCounts.set(currentUserId.toString(),0);
            await conversation.save();
        }

        res.status(200).json({
            success:true,
            messages:message
        })


    }
    catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

    const getConversations = async (req, res) => {
        try{
            const userId = req.user._id;

            const conversations = await Conversation.find({
                participants: userId
            }).populate('participants', 'name email avatar').populate('lastMessages');

        }
        catch(error){
            console.error('Error fetching conversations:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    module.exports = {
        sendMessage,
        getChatHistory,
        getConversations
    }