import { HTTP } from "cloudevents";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
    console.log(receivedEvent);

    res.status(200).json({received: true});
}