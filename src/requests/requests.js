import axios from "axios";

import ControlPanel from "../ControlPanel/ControlPanel";

const fetchData = async (url) => {
  try {
    const result = await axios.get(`http://localhost:5000/api`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const fetchEvents = async (url, clubId) => {
  try {
    const result = await axios.get(`http://localhost:5000/api/${url}`, {
      params: { clubId },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const postEvent = async (data) => {
  try {
    const result = await axios.post("http://localhost:5000/api/events", data);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteEvent = async (id) => {
  try {
    const result = await axios.delete("http://localhost:5000/api/events", {
      data: { id: id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const putEvent = async (data) => {
  try {
    const result = await axios.put("http://localhost:5000/api/events", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const registerUser = async (data) => {
  try {
    const result = await axios.post("http://localhost:5000/register", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (data) => {
  try {
    const result = await axios.post("http://localhost:5000/login", data, {
      withCredentials: true,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const authorizeUser = async () => {
  try {
    const result = await axios.get("http://localhost:5000/authorize", {
      withCredentials: true,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async () => {
  try {
    const result = await axios.get("http://localhost:5000/logout", {
      withCredentials: true,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const fetchUsers = async (clubId) => {
  try {
    const result = await axios.post("http://localhost:5000/users", {
      data: clubId,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const fetchAllUsers = async () => {
  try {
    const result = await axios.get("http://localhost:5000/users");
    return result;
  } catch (error) {
    console.log(error);
  }
};

const updateUserPermissions = async (data) => {
  const userUpdates = data
    .filter((object) => object.updates.length > 0)
    .map((item) => ({ _id: item._id, updates: item.updates }))
    .map((update) => {
      let result = { _id: update._id };

      for (const key in update) {
        if (key === "updates") {
          for (const value in update[key]) {
            for (const i in update[key][value]) {
              if (update[key][value][i] === true) {
                result = {
                  ...result,
                  [i]: [
                    ...[result[i]].filter((item) => item !== undefined),
                    update[key][value].clubId,
                  ].flat(),
                };
              }
            }
          }
        }
      }

      return result;
    });

  try {
    const result = await axios.put("http://localhost:5000/users", userUpdates);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const rejectPermissions = async (user, club) => {
  try {
    const result = await axios.put("http://localhost:5000/rejectuser", {
      _id: user._id,
      clubId: club.value,
      needWriteAccess: user.needWriteAccess,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const updateUserClubs = async (data) => {
  const userUpdates = data;
  try {
    const result = await axios.put(
      "http://localhost:5000/addusers",
      userUpdates
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getClubs = async () => {
  try {
    const result = await axios.get("http://localhost:5000/clubs");

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const postClub = async (data) => {
  try {
    const result = await axios.post("http://localhost:5000/clubs", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getCountries = async () => {
  try {
    const result = await axios.get("https://restcountries.com/v3.1/all");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getAffiliations = async () => {
  try {
    const result = await axios.get("http://localhost:5000/affiliations");
    return result;
  } catch (error) {
    console.log(error);
  }
};

export {
  fetchData,
  fetchEvents,
  postEvent,
  deleteEvent,
  putEvent,
  registerUser,
  loginUser,
  authorizeUser,
  logoutUser,
  fetchUsers,
  fetchAllUsers,
  getClubs,
  postClub,
  getCountries,
  getAffiliations,
  updateUserPermissions,
  rejectPermissions,
  updateUserClubs,
};
