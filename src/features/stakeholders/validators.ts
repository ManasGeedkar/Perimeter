export function validateRegistrationNumber(regNo: string): boolean {
  return regNo.trim().length >= 5;
}

export function validateOfficerId(employeeId: string): boolean {
  return employeeId.trim().length >= 3;
}
