import db from "../../db/db.js";

export const addContact = async (contactInfo) => {
  const { user_id, name, phone, photo, email, address } = contactInfo;
  const [id] = await db("Contact")
    .insert({
      user_id,
      name,
      phone,
      photo,
      email,
      address,
    })
    .returning("id");

  return id;
};

export const getAllContacts = async (userId) => {
  const contacts = await db("Contact")
    .select("id", "name", "phone", "photo", "email", "address", "favorites")
    .where({ user_id: userId });
  return contacts;
};

export const deleteContactById = async (contactId) => {
  const contactFound = await db("Contact")
    .select("*")
    .where({ id: contactId })
    .del();

  return contactFound;
};

export const findContactById = async (contactId) => {
  const contact = await db("Contact").select("*").where({ id: contactId });
  return contact;
};

export const updateContactById = async (contactId, contactData) => {
  await db("Contact").where({ id: contactId }).update(contactData);
};
