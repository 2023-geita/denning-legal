import { Chat } from '@/lib/models/Chat';
import { User } from '@/lib/models/User';
import { Db, MongoClient } from 'mongodb';

export class UserService {
    private static client = new MongoClient(process.env.MONGODB_URI as string);
    private static database: Db;

    private static async connectDb() {
        if (!this.database) {
            try {
                await this.client.connect();
                this.database = this.client.db(process.env.DB_NAME);
            } catch (error) {
                console.error("Failed to connect to DB:", error);
                throw new Error("Database connection error");
            }
        }
    }

    private static async closeDb() {
        await this.client.close;
    }

    static async updateUserChat(email: string, newChat: Chat){
        try {
            const usersCollection = this.database.collection<User>(process.env.USERS_COLLECTION as string);

            const updatedResult = await usersCollection.updateOne(
                {email: email},
                { $push: { chats: newChat } }
            )
        } catch (error) {
            console.error(error)
            console.log("Failed to update user chat")
        }
    }
}