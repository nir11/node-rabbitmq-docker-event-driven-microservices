import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import User from "../schemas/user.model";
let connection: Connection;
let listenerChannel: Channel;
let senderChannel: Channel;

const connectToRabbitMQ = async () => {
  connection = await client.connect(`${process.env.AMQP_URI}`);

  // Create channels
  listenerChannel = await connection.createChannel();

  // Declare the queues we want to use
  await listenerChannel.assertQueue("cat-adoption-responses", {
    durable: true,
  });

  // Listener
  listenerChannel.consume("cat-adoption-responses", handledCatAdoptionResponse);
};

// Send a message to the queue
const sendMessageToRabbitMQ = async (queue: string, message: Buffer) => {
  try {
    senderChannel = await connection.createChannel();
    // Send the message to the queue
    senderChannel.sendToQueue(queue, message);
    console.log("Message sent to queue:", queue);
    senderChannel.close();
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

// Consume a message from the queue
const handledCatAdoptionResponse = async (msg: ConsumeMessage | null) => {
  if (msg !== null) {
    console.log("Message received from queue:", "cat-adoption-responses");
    const { userId, catId, adoptionStatus } = JSON.parse(
      msg.content.toString()
    );

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return;
    }
    if (adoptionStatus === "invalid") {
      user.adoptions = user.adoptions.filter(
        (adoption) => adoption.catId.toString() !== catId
      );
    } else {
      user.adoptions = user.adoptions.map((adoption) => {
        if (adoption.catId.toString() === catId) {
          adoption.status = adoptionStatus;
        }
        return adoption;
      });
    }
    await user.save();
    console.log(
      "User's cat adoption status updated successfully to status:",
      adoptionStatus
    );
    listenerChannel.ack(msg);
  } else {
    console.log("Consumer cancelled by the server!");
  }
};

export { connectToRabbitMQ, sendMessageToRabbitMQ };
