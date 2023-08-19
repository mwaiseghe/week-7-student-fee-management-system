const {Router} = require('express');
const { getStudents, getStudentById, createStudent, 
        updateStudent, softDeleteStudent, makeFeePayment } = require('../Controllers/studentController');
const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', softDeleteStudent);
router.post('/:id/payment', makeFeePayment);

module.exports = router;