// import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import { Entry, IEntry } from "../../../../models";

export default function (req, res) {
  // const { id } = req.query;

  // if (!mongoose.isValidObjectId(id)) {
  //   return res.status(400).json({ message: "Invalid id  " + id });
  // }

  switch (req.method) {
    case "PUT":
      return updateEntry(req, res);

    case "GET":
      return getEntryById(req, res);

    case "DELETE":
      return deleteEntry(req, res);
    default:
      return res
        .status(400)
        .json({ message: "Non existent  method " + req.method });
  }
}

const getEntryById = async (req, res) => {
  const { id } = req.query;

  await db.connect();

  const entryToSend = await Entry.findById(id);
  await db.disconnect();

  if (!entryToSend) {
    return res.status(404).json({ message: "ENTRY NOT FOUND" + id });
  }

  try {
    res.status(200).json(entryToSend);
  } catch (error) {
    console.log({ error });
  }
};

const updateEntry = async (req, res) => {
  console.log("updating entry");
  const { id } = req.query;

  await db.connect();

  const entryToUpdate = await Entry.findById(id);

  if (!entryToUpdate) {
    db.disconnect();
    return res.status(404).json({ message: "ID NOT FOUND" + id });
  }

  // si viene la description, la uso, sino la defino como la anterior desde entryToUpdate
  // si viene el status, lo uso, sino la defino como el anterior de entryToUpdate
  const {
    description = entryToUpdate.description,
    status = entryToUpdate.status,
  } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      { description, status },
      { runValidators: true, new: true }
    );
    await db.disconnect();
    res.status(200).json({ updatedEntry });
  } catch (error) {
    console.log({ error });
    await db.disconnect();
    res.status(400).json({ message: error.message });
  }
};

const deleteEntry = async (req, res) => {
  const { id } = req.query;
  await db.connect();

  const entryToDelete = await Entry.findById(id);

  if (!entryToDelete) {
    db.disconnect();
    return res.status(404).json({ message: "ID NOT FOUND" + id });
  }

  try {
    const deletedEntry = await Entry.findByIdAndDelete(id);
    await db.disconnect();
    res.status(200).json({ deletedEntry });
  } catch (error) {
    console.log({ error });
    await db.disconnect();
    res.status(400).json({ message: error.message });
  }
};
