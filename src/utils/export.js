// Utils untuk export ke file csv
export function convertToCSV(data, headers) {
  if (!data || data.length === 0) return "";

  const csvHeaders = headers || Object.keys(data[0]);

  const headerRow = csvHeaders.join(",");

  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        if (
          value &&
          (value.toString().includes(",") ||
            value.toString().includes('"') ||
            value.toString().includes("\n"))
        ) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value || "";
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

export function downloadCSV(data, filename = "export.csv", headers = null) {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTicketsToCSV(tickets) {
  const formattedData = tickets.map((ticket) => ({
    ID: ticket.id,
    Machine: ticket.productId || ticket.machine?.name || "N/A",
    Problem: ticket.problem,
    "Problem Detail": ticket.problemDetail || "",
    Priority: ticket.priority,
    Status: ticket.status,
    "Created At": new Date(ticket.createdAt).toLocaleString(),
    "Updated At": new Date(ticket.updatedAt).toLocaleString(),
  }));

  const filename = `tickets-export-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  downloadCSV(formattedData, filename);
}

export function exportMachinesToCSV(machines) {
  const formattedData = machines.map((machine) => ({
    ID: machine.id,
    "Product ID": machine.productId,
    Name: machine.name,
    "Created At": new Date(machine.createdAt).toLocaleString(),
    "Updated At": new Date(machine.updatedAt).toLocaleString(),
  }));

  const filename = `machines-export-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  downloadCSV(formattedData, filename);
}

export function exportUsersToCSV(users) {
  const formattedData = users.map((user) => ({
    ID: user.id,
    Name: user.name,
    Username: user.username,
    Email: user.email,
    Role: user.role || "ENGINEER",
    "Is Verified": user.isVerified ? "Yes" : "No",
    "Created At": new Date(user.createdAt).toLocaleString(),
  }));

  const filename = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(formattedData, filename);
}
