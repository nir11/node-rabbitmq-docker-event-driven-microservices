import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import Cat from "../schemas/cat.model";
let connection: Connection;
let listenerChannel: Channel;
let senderChannel: Channel;

const connectToRabbitMQ = async () => {
  connection = await client.connect(`${process.env.AMQP_URI}`);

  // Create channels
  listenerChannel = await connection.createChannel();
  senderChannel = await connection.createChannel();

  // Declare the queues we want to use
  await listenerChannel.assertQueue("cat-adoption-requests", {
    durable: true,
  });

  // Listener
  listenerChannel.consume("cat-adoption-requests", handleCatAdoptionRequest);
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

const handleCatAdoptionRequest = async (msg: ConsumeMessage | null) => {
  if (msg !== null) {
    console.log("Message received from queue:", "cat-adoption-requests");
    const { userId, catId } = JSON.parse(msg.content.toString());
    let message: string;

    const cat = await Cat.findById(catId);
    if (!cat) {
      // Cat not found
      message = JSON.stringify({ userId, catId, adoptionStatus: "invalid" });
      sendMessageToRabbitMQ("cat-adoption-responses", Buffer.from(message));
      return;
    }

    // Randomly choose whether to confirm or reject the adoption request
    const adoptionStatus: "confirmed" | "rejected" =
      Math.random() < 0.5 ? "confirmed" : "rejected";

    if (adoptionStatus === "confirmed") {
      // Update cat's adotion status
      cat.isAdopted = true;
      cat.adoptedBy = userId;
      cat.adoptionDate = new Date();
      await cat.save();
    }

    // Notify the user with the adoption response through the notification-service
    message = JSON.stringify({
      userId,
      catId,
      catName: cat.name,
      adoptionStatus,
    });
    sendMessageToRabbitMQ("cat-adoption-notifications", Buffer.from(message));

    // Upate user's adoption status in user-service
    message = JSON.stringify({ userId, catId, adoptionStatus });
    sendMessageToRabbitMQ("cat-adoption-responses", Buffer.from(message));
    console.log(
      "Car adoption process done, and updated to status:",
      adoptionStatus
    );
    listenerChannel.ack(msg);
  } else {
    console.log("Consumer cancelled by the server");
  }
};

export { connectToRabbitMQ };
