/** Keep only appointments created by the connected transporter. */
export function filterMyAppointments(appointments, userId, username) {
  const list = appointments || [];
  const numericUserId = Number(userId);

  if (Number.isFinite(numericUserId)) {
    const byId = list.filter((a) => Number(a.createdById) === numericUserId);
    if (byId.length > 0) return byId;
  }

  if (username) {
    const normalizedUsername = String(username).trim().toLowerCase();
    const byUsername = list.filter((a) => String(a.createdByUsername || '').trim().toLowerCase() === normalizedUsername);
    if (byUsername.length > 0) return byUsername;
  }

  return list;
}
