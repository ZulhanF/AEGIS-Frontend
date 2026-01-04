const BASE_URL = import.meta.env.DEV
  ? "/api/v1" // Dev dg proxy              
  : "https://backend-ruddy-eta.vercel.app/api/v1"; // prod

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function putAccessToken(accessToken) {
  return localStorage.setItem("accessToken", accessToken);
}

async function fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Login failed");
  }

  // Backend mengembalikan { message, data: { token, user } }
  return { error: false, data: responseJson.data };
}

async function register({ name, username, email, password }) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, username, email, password }),
  });

  const responseJson = await response.json();

  // Check jika response tidak OK atau ada error dari backend
  if (!response.ok) {
    throw new Error(responseJson.message || "Registration failed");
  }

  return { error: false, data: responseJson.data };
}

async function getUserLogged() {
  const response = await fetchWithToken(`${BASE_URL}/auth/me`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data.user };
}

function removeAccessToken() {
  return localStorage.removeItem("accessToken");
}

// Ticket API
async function getTicketsByMachine(machineId) {
  const response = await fetchWithToken(
    `${BASE_URL}/machines/${machineId}/tickets`
  );
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch tickets",
    };
  }

  return { error: false, data: responseJson.data.tickets };
}

async function getTickets() {
  // const data = ticket;
  const response = await fetchWithToken(`${BASE_URL}/tickets`);
  const responseJson = await response.json();
  return { error: false, data: responseJson.data.tickets };
  // return { error: false, data };
}

// Untuk submit tiket baru
async function createTicket(ticketData) {
  const body = {
    productId: ticketData.machine,
    priority: ticketData.priority.toUpperCase(),
    status: "OPEN",
    problem: ticketData.problem,
    problemDetail: ticketData.detail,
    isPublished: true,
  };

  const response = await fetchWithToken(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to create ticket");
  }

  return { error: false, data: responseJson.data.ticket };
}

async function updateTicket(ticketId, ticketData) {
  const response = await fetchWithToken(`${BASE_URL}/tickets/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketData),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to update ticket");
  }

  return { error: false, data: responseJson.data.ticket };
}

async function deleteTicket(ticketId) {
  const response = await fetchWithToken(`${BASE_URL}/tickets/${ticketId}`, {
    method: "DELETE",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      message: responseJson.message || "Failed to delete ticket",
    };
  }

  return { error: false, message: responseJson.message };
}

// Machine API
async function getMachines() {
  const response = await fetchWithToken(`${BASE_URL}/machines`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch machines",
    };
  }

  return { error: false, data: responseJson.data.machines };
}

async function addMachine(machineData) {
  const body = {
    name: machineData.name,
    productId: machineData.productId,
  };
  const response = await fetchWithToken(`${BASE_URL}/machines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to add machine");
  }

  return { error: false, data: responseJson.data.machine };
}

async function deleteMachine(machineId) {
  const response = await fetchWithToken(`${BASE_URL}/machines/${machineId}`, {
    method: "DELETE",
  });
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      message: responseJson.message || "Failed to delete ticket",
    };
  }

  return { error: false, message: responseJson.message };
}

async function editMachine(machineId, machineData) {
  const response = await fetchWithToken(`${BASE_URL}/machines/${machineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(machineData),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to edit machine");
  }

  return { error: false, data: responseJson.data.machine };
}

// Machine Status API Functions
async function getMachineStatuses() {
  const response = await fetchWithToken(`${BASE_URL}/machines/statuses/all`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch machine statuses",
    };
  }

  return { error: false, data: responseJson.data };
}

async function getMachineStatusByMachineId(machineId) {
  const response = await fetchWithToken(
    `${BASE_URL}/machines/${machineId}/statuses`
  );
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch machine status",
    };
  }

  // Handle jika data adalah array
  const statusData = responseJson.data;
  
  // Return seluruh array untuk history, atau ambil yang terbaru untuk single status
  if (Array.isArray(statusData)) {
    return { error: false, data: statusData }; // Return all for history
  }
  
  // Jika statusData punya property statuses (nested)
  if (statusData?.statuses && Array.isArray(statusData.statuses)) {
    return { error: false, data: statusData.statuses };
  }

  // Jika single object, wrap in array
  return { error: false, data: [statusData] };
}

async function createMachineStatus(statusData) {
  console.log("Sending status data:", statusData);
  
  const processedData = {
    ...statusData,
    airTemperature: Number(statusData.airTemperature) || 0,
    processTemperature: Number(statusData.processTemperature) || 0,
    rotationalSpeed: Number(statusData.rotationalSpeed) || 0,
    torque: Number(statusData.torque) || 0,
    toolWear: Number(statusData.toolWear) || 0,
    target: Number(statusData.target) || 0,
  };
    
  const response = await fetchWithToken(`${BASE_URL}/machines/statuses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(processedData),
  });

  const responseJson = await response.json();
  console.log("Backend response:", responseJson);

  if (!response.ok || responseJson.error) {
    if (responseJson.errors && Array.isArray(responseJson.errors)) {
      const errorMessages = responseJson.errors.map(err => err.message).join(", ");
      throw new Error(errorMessages);
    }
    throw new Error(responseJson.message || responseJson.error || "Failed to create machine status");
  }

  return { error: false, message: responseJson.message };
}

async function updateMachineStatus(statusId, statusData) {
  const response = await fetchWithToken(
    `${BASE_URL}/machines/statuses/${statusId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    }
  );

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to update machine status");
  }

  return { error: false, message: responseJson.message, data: responseJson.data };
}

async function deleteMachineStatus(statusId) {
  const response = await fetchWithToken(
    `${BASE_URL}/machines/statuses/${statusId}`,
    {
      method: "DELETE",
    }
  );

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      message: responseJson.message || "Failed to delete machine status",
    };
  }

  return { error: false, message: responseJson.message };
}

// User Management API
async function getAllUsers() {
  const response = await fetchWithToken(`${BASE_URL}/users`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch users",
    };
  }

  return { error: false, data: responseJson.data.users };
}

async function getUserById(userId) {
  const response = await fetchWithToken(`${BASE_URL}/users/${userId}`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch user",
    };
  }

  return { error: false, data: responseJson.data.user };
}

async function verifyUser(userId) {
  const response = await fetchWithToken(`${BASE_URL}/users/${userId}/verify`, {
    method: "PATCH",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to verify user");
  }

  return { error: false, data: responseJson.data.user, message: responseJson.message };
}

async function unverifyUser(userId) {
  const response = await fetchWithToken(`${BASE_URL}/users/${userId}/unverify`, {
    method: "PATCH",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to unverify user");
  }

  return { error: false, data: responseJson.data.user, message: responseJson.message };
}

async function deleteUser(userId) {
  const response = await fetchWithToken(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      message: responseJson.message || "Failed to delete user",
    };
  }

  return { error: false, message: responseJson.message };
}

// Chat API
async function getChatMessages() {
  const response = await fetchWithToken(`${BASE_URL}/chat`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      data: null,
      message: responseJson.message || "Failed to fetch chat messages",
    };
  }

  return { error: false, data: responseJson.data.messages };
}

async function createChatMessage(content) {
  const response = await fetchWithToken(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to create chat message");
  }

  return { error: false, data: responseJson.data.message };
}

async function deleteAllChatMessages() {
  const response = await fetchWithToken(`${BASE_URL}/chat`, {
    method: "DELETE",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      message: responseJson.message || "Failed to delete all chat messages",
    };
  }

  return { error: false, message: responseJson.message };
}

async function deleteChatMessageById(messageId) {
  const response = await fetchWithToken(`${BASE_URL}/chat/${messageId}`, {
    method: "DELETE",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    return {
      error: true,
      message: responseJson.message || "Failed to delete chat message",
    };
  }

  return { error: false, message: responseJson.message };
}

// Overview API
async function getOverview() {
  const response = await fetchWithToken(`${BASE_URL}/overview`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.error) {
    throw new Error(responseJson.message || "Failed to get overview data");
  }

  return responseJson.data;
}

export {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  login,
  register,
  getUserLogged,
  getTickets,
  getTicketsByMachine,
  createTicket,
  updateTicket,
  deleteTicket,
  getMachines,
  addMachine,
  deleteMachine,
  editMachine,
  getMachineStatuses,
  getMachineStatusByMachineId,
  createMachineStatus,
  updateMachineStatus,
  deleteMachineStatus,
  getAllUsers,
  getUserById,
  verifyUser,
  unverifyUser,
  deleteUser,
  getChatMessages,
  createChatMessage,
  deleteAllChatMessages,
  deleteChatMessageById,
  getOverview,
};
