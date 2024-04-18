// publisher.js

const amqp = require('amqplib');

async function publishLogEvent(event) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('logs-events');

    console.log('Product event publisher connected to RabbitMQ');

    channel.sendToQueue('logs-events', Buffer.from(JSON.stringify(event)));
    console.log('Product event published:', event);
    setTimeout(() => {
        connection.close();
    }, 500);
}

async function publishNotificationEvent(event) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('notifications-events');

    console.log('User event publisher connected to RabbitMQ');

    channel.sendToQueue('notifications-events', Buffer.from(JSON.stringify(event)));
    console.log('User event published:', event);
    setTimeout(() => {
        connection.close();
    }, 500);
}

module.exports = { publishLogEvent, publishNotificationEvent };
