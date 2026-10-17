import React from 'react';
import { Navigate } from 'react-router-dom';

/** مسار قديم — حضور اليوم يسجَّل داخل صحة كل قسم مباشرة. */
const TeacherAttendanceRedirect: React.FC = () => <Navigate to="/teacher" replace />;

export default TeacherAttendanceRedirect;
