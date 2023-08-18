const {Router} = require('express');
const { getStudents, getStudentById, createStudent, 
        updateStudent, softDeleteStudent } = require('../Controllers/studentController');
const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', softDeleteStudent);

module.exports = router;