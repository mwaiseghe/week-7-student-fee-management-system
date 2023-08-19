const mssql = require('mssql');
const { v4 } = require('uuid');

const { createStudent, updateStudent, softDeleteStudent, getStudents, getStudentById, makeFeePayment } = require('../Controllers/studentController');
/**
 * Mocking the request and response objects
 */
const req = {
    body: {
        name: 'Gift Mwaiseghe',
        class_in: 'COM 19',
        fee_balance: 10000
    }
}

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

/**
 * Student Controller Tests
 */

describe('Student Controller', () => {
    describe('Fetch All Students', () => {
        // check if students are fetched
        it('should return a success message if students are fetched', async () => {
            const students = [
                {
                    "id": "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                    "name": "Gift Watatu",
                    "class": "Com 19",
                    "fee_balance": 1000,
                    "is_active": true,
                    "created_at": "2023-08-18T11:13:00.260Z",
                    "updated_at": "2023-08-18T11:13:00.260Z"
                },
                {
                    "id": "7a7f76a1-36a1-4312-8ec6-019201a025c1",
                    "name": "Gift Wapili",
                    "class": "Com 19",
                    "fee_balance": 1000,
                    "is_active": true,
                    "created_at": "2023-08-18T11:12:54.827Z",
                    "updated_at": "2023-08-18T11:12:54.827Z"
                }
            ];

            const req = {}

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: students
                })
            });

            await getStudents(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                students: students,
                message: 'Students fetched successfully'
            });
        });

        // check if students are not fetched
        it('should return an error message if students are not fetched', async () => {
            const req = {}

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockRejectedValueOnce(new Error('Students not fetched'))
            });

            await getStudents(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Students not fetched'
            });
        });

    });

    describe('Fetch One Student', () => {
        // check if student exists
        it('should return an error if student does not exist', async () => {
            const req = {
                params: {
                    id: "dgjhdjsb",
                }
            }

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            await getStudentById(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student does not exist'
            });
        });

        // check if student is fetched
        it('should return a success message if student is fetched', async () => {
            const req = {
                params: {
                    id: "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                }
            }

            const student = {
                "id": "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                "name": "Gift Watatu",
                "class": "Com 19",
                "fee_balance": 1000,
                "is_active": true,
                "created_at": "2023-08-18T11:13:00.260Z",
                "updated_at": "2023-08-18T11:13:00.260Z"
            };

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [student]
                })
            });

            await getStudentById(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                student: student
            });

        });

    });

    describe('Create Student', () => {
        // check if all fields are provided
        it('should return an error if all fields are not provided', async () => {
            // act
            const req = {
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19'
                }
            }

            await createStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All fields are required'
            });

        });

        // check if student already exists
        it('should return an error if student already exists', async () => {
            // act
            const req = {
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19',
                    fee_balance: 10000
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [req.body]
                })
            });

            await createStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student already exists'
            });

        });

        // check if student is created
        it('should return a success message if student is created', async () => {
            // mocking mssql module
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            // act
            const req = {
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19',
                    fee_balance: 10000
                }
            }

            await createStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student created successfully'
            });
        });

        it('should return an error message if student is not created', async () => {
            // mocking mssql module
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockRejectedValueOnce(new Error('Student not created'))
            });

            // act
            const req = {
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19',
                    fee_balance: 10000
                }
            }

            await createStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student not created'
            });
        });
    
        /**
         * Update Student Tests: 
         * Contains all the tests for the updateStudent function
         */
    describe('Update Student', () => {
        // check if student exists
        it('should return an error if student does not exist', async () => {
            const req = {
                params: {
                    id: "dgjhdjsb",
                },
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19',
                    fee_balance: 10000
                }
            }

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            await updateStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student does not exist'
            });
        });

        // check if student is updated
        it('should return a success message if student is updated', async () => {
            const req = {
                params: {
                    id: "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                },
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19',
                    fee_balance: 10000
                }
            }

            const student = {
                "id": "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                "name": "Gift Watatu",
                "class": "Com 19",
                "fee_balance": 1000,
                "is_active": true,
                "created_at": "2023-08-18T11:13:00.260Z",
                "updated_at": "2023-08-18T11:13:00.260Z"
            };

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [student]
                })
            });

            await updateStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student updated successfully'
            });

        });

        it('should return an error message if student is not updated', async () => {
            // mocking mssql module
            jest.spyOn(mssql, 'connect').
                mockResolvedValueOnce({
                    request: jest.fn().mockReturnThis(),
                    input: jest.fn().mockReturnThis(),
                    execute: jest.fn().mockRejectedValueOnce(new Error('Student not updated'))
                });

            // act
            const req = {
                params: {
                    id: "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                },
                body: {
                    name: 'Gift Mwaiseghe',
                    class_in: 'COM 19',
                    fee_balance: 10000
                }
            }

            await updateStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student not updated'
            });
        });

    });

    /**
     * Soft Delete Student Tests:
     * Contains all the tests for the softDeleteStudent function
     */
    describe('Soft Delete Student', () => {
        // check if student exists
        it('should return an error if student does not exist', async () => {
            const req = {
                params: {
                    id: "dgjhdjsb",
                }
            }

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            await softDeleteStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student does not exist'
            });
        });

        // check if student is soft deleted
        it('should return a success message if student is soft deleted', async () => {
            const req = {
                params: {
                    id: "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                }
            }

            const student = {
                "id": "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                "name": "Gift Watatu",
                "class": "Com 19",
                "fee_balance": 1000,
                "is_active": true,
                "created_at": "2023-08-18T11:13:00.260Z",
                "updated_at": "2023-08-18T11:13:00.260Z"
            };

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [student]
                })
            });

            await softDeleteStudent(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student deleted successfully'
            });

        });
    });

    /** 
     * Make Fee Payment Tests:
     * Contains all the tests for the makeFeePayment function
    */
    describe('Make Fee Payment', () => {
        // check if student exists
        it('should return an error if student does not exist', async () => {
            const req = {
                params: {
                    id: "dgjhdjsb",
                },
                body: {
                    amount: 10000
                }
            }

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            });

            await makeFeePayment(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Student does not exist'
            });
        });

        // check if student is soft deleted
        it('should return a success message payment is made', async () => {
            const req = {
                params: {
                    id: "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                },
                body: {
                    amount: 10000
                }
            }

            const student = {
                "id": "6a390e91-0d8e-4ea3-b47d-68436d31027a",
                "name": "Gift Watatu",
                "class": "Com 19",
                "fee_balance": 1000,
                "is_active": true,
                "created_at": "2023-08-18T11:13:00.260Z",
                "updated_at": "2023-08-18T11:13:00.260Z"
            };

            // act
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [student]
                })
            });

            await makeFeePayment(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Fee Payment made successfully'
            });

        });



    });

});

});

