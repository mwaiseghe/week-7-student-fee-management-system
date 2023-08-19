USE students_fee_management_system;
GO


-- Procedure to create a new student

CREATE OR ALTER PROCEDURE create_student
    @id VARCHAR(255),
    @name VARCHAR(255),
    @class VARCHAR(255),
    @fee_balance INT
AS
BEGIN
    INSERT INTO students (id, name, class, fee_balance)
    VALUES (@id, @name, @class, @fee_balance);
END;
GO

-- Procedure to get all students
CREATE OR ALTER PROCEDURE get_all_students
AS
BEGIN
    SELECT * FROM students;
END;
GO

-- Procedure to get a student by id 
CREATE OR ALTER PROCEDURE get_student_by_id
    @id VARCHAR(255)
AS
BEGIN
    SELECT * FROM students WHERE id = @id;
END;
GO

-- Procedure to get a student by name
CREATE OR ALTER PROCEDURE get_student_by_name
    @name VARCHAR(255)
AS
BEGIN
    SELECT * FROM students WHERE name = @name;
END;
GO

-- Procedure to update a student
CREATE OR ALTER PROCEDURE update_student_proc
    @id VARCHAR(255),
    @name VARCHAR(255),
    @class VARCHAR(255),
    @fee_balance INT
AS
BEGIN
    UPDATE students
    SET name = @name, class = @class, fee_balance = @fee_balance
    WHERE id = @id;
END;
GO

-- Procedure to delete a student (soft delete)
CREATE OR ALTER PROCEDURE delete_student_soft
    @id VARCHAR(255)
AS
BEGIN
    UPDATE students
    SET is_active = 0
    WHERE id = @id;
END;
GO

-- Procedure to create a new fee payment
CREATE OR ALTER PROCEDURE create_fee_payment
    @id VARCHAR(255),
    @student_id VARCHAR(255),
    @amount INT
AS
BEGIN
    INSERT INTO fee_payments (id, student_id, amount)
    VALUES (@id, @student_id, @amount);
    UPDATE students SET fee_balance = fee_balance - @amount WHERE id = @student_id;
END;
GO


-- Procedure to get a student's fee balance

CREATE OR ALTER PROCEDURE get_student_fee_balance
    @id VARCHAR(255)
AS
BEGIN
    SELECT fee_balance FROM students WHERE id = @id;
END;