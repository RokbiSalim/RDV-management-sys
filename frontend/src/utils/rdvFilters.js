/** Keep only appointments created by the connected transporter. */
export function filterMyAppointments(appointments, userId) {
  if (!userId) return appointments;
  return (appointments || []).filter((a) => Number(a.createdById) === Number(userId));
}
