const BASE_URL = "http://localhost:5000/api";

const req = async (method, path, body, token) => {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const formReq = async (method, path, formData, token) => {
  const opts = { method, credentials: "include", headers: {} };
  if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  opts.body = formData;
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// AUTH
export const loginUser = (body) => req("POST", "/user/login", body);
export const loginWorker = (body) => req("POST", "/worker/login", body);
export const loginAdmin = (body) => req("POST", "/admin/login", body);

// USER
export const createUser = (formData) => formReq("POST", "/user/create", formData);
export const updateUser = (id, body, token) => req("PUT", `/user/update/${id}`, body, token);
export const deleteUser = (id, token) => req("DELETE", `/user/delete/${id}`, null, token);
export const getUser = (id, token) => req("GET", `/user/get/${id}`, null, token);
export const logoutUser = (token) => req("POST", "/user/logout", null, token);
export const changePassword = (body, token) => req("PUT", "/user/change-password", body, token);
export const changeImage = (formData, token) => formReq("PUT", "/user/change-image", formData, token);

// WORKER
export const createWorker = (formData) => formReq("POST", "/worker/create", formData);
export const getAllWorkers = (token) => req("GET", "/worker", null, token);
export const getWorkersByCategory = (cat, token) => req("GET", `/worker/${cat}`, null, token);
export const getWorkerById = (id, token) => req("GET", `/worker/${id}`, null, token);
export const updateWorker = (formData, token) => formReq("PUT", "/worker/update", formData, token);
export const deleteWorker = (body, token) => req("DELETE", "/worker/delete", body, token);
export const logoutWorker = (token) => req("POST", "/worker/logout", null, token);
export const changeWorkerPassword = (body, token) => req("PUT", "/worker/change-password", body, token);

// BOOKING
export const createBooking = (body, token) => req("POST", "/booking/create", body, token);
export const updateBooking = (body, token) => req("PUT", "/booking/update", body, token);
export const userCancelBooking = (body, token) => req("PUT", "/booking/user-cancel", body, token);
export const workerCancelBooking = (body, token) => req("PUT", "/booking/worker-cancel", body, token);
export const getUserBookings = (userId, token) => req("GET", `/booking/user/${userId}`, null, token);
export const getWorkerBookings = (workerId, token) => req("GET", `/booking/worker/${workerId}`, null, token);

// REVIEW
export const reviewWorker = (body, token) => req("POST", "/review/create", body, token);

// ADMIN
export const createAdmin = (body, token) => req("POST", "/admin/create", body, token);
export const getAdmin = (body, token) => req("GET", "/admin/get", body, token);
export const deleteAdmin = (body, token) => req("DELETE", "/admin/delete", body, token);
