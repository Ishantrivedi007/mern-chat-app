import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (request, response) => {
  try {
    const loggedInUserId = request.user._id;
    //$ne = not equal
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return response.status(200).json({
      success: true,
      message: "Contacts fetched successfully.",
      filteredUsers,
    });
  } catch (error) {
    console.log("Error in getAllContacts controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getChatPartners = async (request, response) => {
  try {
    const loggedInUserId = request.user._id;

    //find all the messages where the logged in user is the sender or the receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");
    return response.status(200).json({
      success: true,
      message: "Chat Partners fetched successfully.",
      chatPartners,
    });
  } catch (error) {
    console.log("Error in getChatPartners controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getMessagesByUserId = async (request, response) => {
  try {
    const myId = request.user._id;
    const { id: userToChatId } = request.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return response.status(200).json({
      success: true,
      message: "Messages fetched successfully.",
      messages,
    });
  } catch (error) {
    console.log("Error in getMessagesByUserId controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const sendMessage = async (request, response) => {
  try {
    const { text, image } = request.body;
    const { id: receiverId } = request.params;
    const senderId = request.user._id;
    if (!text && !image) {
      return response
        .status(400)
        .json({ success: false, message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return response
        .status(400)
        .json({ success: false, message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return response
        .status(404)
        .json({ success: false, message: "Receiver not found." });
    }
    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url; //url of uploaded image
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //TODO socket implementation
    return response
      .status(200)
      .json({ success: true, message: "Sent", newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
