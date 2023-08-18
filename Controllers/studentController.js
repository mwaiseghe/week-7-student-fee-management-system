const {v4} = require('uuid');
const {mssql, sqlConfig} = require('../Config/config');


const getStudents = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        // getting all the students
        const students = await pool.request()
            .execute('get_all_students');

        if(students.recordset.length > 0){
            return res.status(200).json({
                students: students.recordset,
                message: "Students fetched successfully"
            });
        }

        return res.status(404).json({
            message: "No students found"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getStudentById = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // getting a student by id
        const student = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_student_by_id');

        if(student.recordset.length > 0){
            return res.status(200).json({
                student: student.recordset[0]
            });
        }

        return res.status(404).json({
            message: "Student does not exist"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const createStudent = async (req, res) => {
    try {
        const {name, class_in, fee_balance} = req.body;

        // validating if all the fields are entered
        if(!name || !class_in || !fee_balance){
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // validating if the student already exists
        const student = await pool.request()
            .input('name', mssql.VarChar, name)
            .execute('get_student_by_name');

        if(student.recordset.length > 0){
            return res.status(400).json({
                message: "Student already exists"
            });
        }

        const student_id = v4();

        // creating a new student
        const newStudent = await pool.request()
            .input('id', mssql.VarChar, student_id)
            .input('name', mssql.VarChar, name)
            .input('class', mssql.VarChar, class_in)
            .input('fee_balance', mssql.Int, fee_balance)
            .execute('create_student');

        if(newStudent.rowsAffected.length > 0){
            return res.status(200).json({
                message: "Student created successfully"
            });
        }

        return res.status(400).json({
            message: "Student creation failed"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}



const updateStudent = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, class_in, fee_balance} = req.body;

        // validating if all the fields are entered
        if(!name || !class_in || !fee_balance){
            return res.status(400).json({
                message: "Please enter all the fields"
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // validating if the student already exists
        const student = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_student_by_id');

        if(student.recordset.length === 0){
            return res.status(400).json({
                message: "Student doesn't exist"
            });
        }

        // updating a student
        const updatedStudent = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('name', mssql.VarChar, name)
            .input('class', mssql.VarChar, class_in)
            .input('fee_balance', mssql.Int, fee_balance)
            .execute('update_student');

        if(updatedStudent.rowsAffected.length > 0){
            return res.status(200).json({
                message: "Student updated successfully"
            });
        }

        return res.status(400).json({
            message: "Student updation failed"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const softDeleteStudent = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // validating if the student already exists
        const student = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_student_by_id');

        if(student.recordset.length === 0){
            return res.status(400).json({
                message: "Student doesn't exist"
            });
        }

        // soft deleting a student
        const deletedStudent = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('delete_student_soft');

        if(deletedStudent.rowsAffected.length > 0){
            return res.status(200).json({
                message: "Student deleted successfully"
            });
        }

        return res.status(400).json({
            message: "Student deletion failed"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    softDeleteStudent
}