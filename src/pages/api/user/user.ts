import { Chat } from '@/lib/models/Chat';
import { User } from '@/lib/models/User';
import { UserService } from '@/services/user.service';
import { Db, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const client = new MongoClient(process.env.MONGODB_URI as string);
        let database: Db;
        try {
            await client.connect();
            database = client.db(process.env.DB_NAME);

            const userInfo = JSON.parse(req.body);

            const usersCollection = database.collection(process.env.USERS_COLLECTION as string);

            const result = await usersCollection.insertOne(userInfo);
            const savedUser = { _id: result.insertedId, ...userInfo };

            res.status(201).json({ message: "User info saved successfully!", savedUser });

        } catch (error) {
            res.status(500).json({ message: "Could not connect to database" });
        } finally {
            await client.close();
        }

    } else if (req.method === "GET") {
        const client = new MongoClient(process.env.MONGODB_URI as string);
        let database: Db;
        try {
            await client.connect();
            database = client.db(process.env.DB_NAME);
            const usersCollection = database.collection(process.env.USERS_COLLECTION as string);

            const email = req.query.email as string;

            const savedUsed = await usersCollection.findOne({ email: email });

            res.status(200).json(savedUsed as unknown as User);


        } catch (error) {
            res.status(500).json({ message: "Could not connect to database" });
        } finally {
            await client.close();
        }


    } else if (req.method === "PATCH") {
        const email = req.query.email as string;
        const chat = JSON.parse(req.body) as Chat;

        await UserService.updateUserChat(email, chat)

        res.status(200).json({ message: "Chat updated successfully" })
    }
    else {
        res.status(405).json({ message: "Method not allowed!" });
    }




}