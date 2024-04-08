class Message {
    constructor(sender, receiver, content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        }
    }

    export default class MessagingSystem {
        constructor() {
        this.messages = [];
        this.observers = [];
        }

        notifyObservers(message) {
        for (let observer of this.observers) {
            if (observer.receiver === message.receiver) {
            observer.update(message);
            }
        }
        }

        sendMessage(message) {
        this.messages.push(message);
        this.notifyObservers(message);
        }

        receiveMessages(receiver) {
        return this.messages.filter(message => message.receiver === receiver);
        }
    }

    export class Observer {
        constructor(receiver) {
        this.receiver = receiver;
        }

        update(message) {
        if (message.receiver === this.receiver) {
            console.log(`New message for ${this.receiver}: ${message.content}`);
        }
    }
}

