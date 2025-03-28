import { Request, Response } from "express";
import { z } from "zod";
import { forumModel } from "../models/db";
import { embedtext } from "../lib/vectorizeText";
import { weaviateClient } from "../models/weaviate";


export const createForumhandler = async(req: Request, res: Response) => {
    const forumSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(10)
    })
    const response = forumSchema.safeParse(req.body);
    if(!response.success){
        res.status(411).json({
            msg: "Incorrect Format",
            error: response.error.errors
        })
        return;
    }
    let forumMongo = null
    try{
        const {title, description} = req.body

        forumMongo = await forumModel.create({
            title,
            description,
            createdBy: req.admin._id
        })

        const vector = await embedtext(title + " " + description)

        const forumWeaviate = await weaviateClient.data.creator()
            .withClassName("Forum")
            .withProperties({
                title,
                description
            })
            .withVector(vector)
            .do()

        res.json({
            msg: "Forum created succssfully",
            forumMongo,
            forumWeaviate
        })
    }catch(e) {
        if (forumMongo) {
            await forumModel.deleteOne({ _id: forumMongo._id });
        }
        console.log("error: ", e)
        res.status(500).json({msg: "Internal server error"})
    }
}