import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  cid?: string;
  reason?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    // Post object to the IPFS
  
  } else {
    res.status(400).json({ reason: "bad request" });
  }
};
