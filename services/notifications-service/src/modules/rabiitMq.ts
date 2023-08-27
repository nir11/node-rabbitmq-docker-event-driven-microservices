import client, { Connection, Channel, ConsumeMessage } from "amqplib";
let listenerChannel: Channel;

const connectToRabbitMQ = async () => {
  const connection: Connection = await client.connect(
    `${process.env.AMQP_URI}`
  );

  // Create a channel
  listenerChannel = await connection.createChannel();

  // Declare the queues we want to use
  await listenerChannel.assertQueue("cat-adoption-notifications", {
    durable: true,
  });

  // Listener
  listenerChannel.consume(
    "cat-adoption-notifications",
    handleCatAdoptionNotification
  );
};

// Consume a message from the queue
const handleCatAdoptionNotification = (msg: ConsumeMessage | null) => {
  if (msg !== null) {
    console.log("Message received from queue:", "cat-adoption-notifications");
    const { userId, catId, adoptionStatus } = JSON.parse(
      msg.content.toString()
    );
    if (adoptionStatus === "confirmed") {
      // Send confirm notification here
    } else if (adoptionStatus === "rejected") {
      // Send reject notification here
    }
    listenerChannel.ack(msg);
    console.log("Notification sent successfully!");
  } else {
    console.log("Consumer cancelled by the server");
  }
};

export { connectToRabbitMQ };
