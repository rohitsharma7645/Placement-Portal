import database from "../config/firebase.js";

export const addStudent = async (request, response, next) => {
  try {
    const student = await database.ref("students").push(request.body);
    response.json({
      success: true,
      message: "Student Added Successfully",
      id: student.key,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (_request, response, next) => {
  try {
    const snapshot = await database.ref("students").get();
    const students = snapshot.val();
    response.json(
      students
        ? Object.entries(students).map(([id, student]) => ({ ...student, id }))
        : [],
    );
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (request, response, next) => {
  try {
    await database.ref(`students/${request.params.studentId}`).remove();
    response.json({ success: true, message: "Student Deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (request, response, next) => {
  try {
    await database.ref(`students/${request.params.studentId}`).update(request.body);
    response.json({ success: true, message: "Student Updated" });
  } catch (error) {
    next(error);
  }
};
