import type { NextApiRequest, NextApiResponse } from "next";
import { Blob, File, Web3Storage } from "web3.storage";

type Data = {
  cid?: string;
  reason?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    // Post object to the IPFS
    try {
      const storage = new Web3Storage({ token: process.env.WEB_STORAGE_KEY });
      const blob = new Blob([JSON.stringify(req.body)], {
        type: "application/json",
      });

      const cid = await storage.put([new File([blob], "metadata.json")]);

      // Return the CID
      res.status(200).json({ cid: cid });
    } catch (e) {
      console.log(e);
      res.status(400).json({ reason: "something went wrong." });
    }
  } else {
    res.status(400).json({ reason: "bad request" });
  }
};
