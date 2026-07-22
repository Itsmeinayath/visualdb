import studentsData from "../data/students.json";
import employeesData from "../data/employees.json";
import ordersData from "../data/orders.json";
import coursesData from "../data/courses.json";
import teachersData from "../data/teachers.json";

export const DB = {
  students: studentsData,
  employees: employeesData,
  orders: ordersData,
  courses: coursesData,
  teachers: teachersData,
};

export const getTable = (tableName) => {
  if (!DB[tableName]) {
    throw new Error(`Table '${tableName}' does not exist. Try 'students', 'employees', 'orders', 'courses', or 'teachers'.`);
  }
  return DB[tableName];
};
