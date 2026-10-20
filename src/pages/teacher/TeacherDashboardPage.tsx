import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  teacherAPI, 
  type TeacherSection, 
  type SectionStudent,
  type AttendanceEntry,
  type ResultEntry
} from '../../services/teacherApi';
import EmptyState from '../../components/EmptyState';

export default function TeacherDashboardPage() {
  const [sections, setSections] = useState<TeacherSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<TeacherSection | null>(null);
  const [students, setStudents] = useState<SectionStudent[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'homework'>('attendance');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- ATTENDANCE STATE ---
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceState, setAttendanceState] = useState<Record<number, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  // --- GRADES STATE ---
  const [subject, setSubject] = useState('');
  const [term, setTerm] = useState('الثلاثي الأول');
  const [scoresState, setScoresState] = useState<Record<number, string>>({});
  const [savingGrades, setSavingGrades] = useState(false);

  // --- HOMEWORK & ANNOUNCEMENT STATE ---
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  // 1. Fetch Teacher Sections on Mount
  const fetchSections = async () => {
    setLoadingSections(true);
    setFeedbackMessage(null);
    try {
      const data = await teacherAPI.getSections();
      setSections(data);
      if (data.length > 0) {
        setSelectedSection(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to fetch teacher sections:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'تعذر جلب الأقسام المسندة إليك. تأكد من اتصالك بالإنترنت.',
      });
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // 2. Fetch Students when Selected Section changes
  useEffect(() => {
    if (!selectedSection) {
      setStudents([]);
      return;
    }

    const fetchRoster = async () => {
      setLoadingStudents(true);
      setFeedbackMessage(null);
      try {
        const roster = await teacherAPI.getSectionStudents(selectedSection.id);
        setStudents(roster);

        // Initialize all students to 'present' by default for convenience
        const defaultAttendance: Record<number, 'present' | 'absent' | 'late' | 'excused'> = {};
        roster.forEach((st) => {
          defaultAttendance[st.enrollment_id] = 'present';
        });
        setAttendanceState(defaultAttendance);
        setScoresState({});
      } catch (err: any) {
        console.error('Failed to fetch section roster:', err);
        setFeedbackMessage({
          type: 'error',
          text: 'تعذر جلب قائمة تلاميذ هذا القسم.',
        });
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchRoster();
  }, [selectedSection]);

  // --- Actions ---

  const handleAttendanceToggle = (enrollmentId: number, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceState((prev) => ({
      ...prev,
      [enrollmentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSection || students.length === 0) return;

    setSavingAttendance(true);
    setFeedbackMessage(null);

    const entries: AttendanceEntry[] = students.map((s) => ({
      enrollment_id: s.enrollment_id,
      status: attendanceState[s.enrollment_id] || 'present',
    }));

    try {
      const res = await teacherAPI.saveAttendance(selectedSection.id, attendanceDate, entries);
      setFeedbackMessage({
        type: 'success',
        text: `تم حفظ تسجيل الحضور بنجاح (${res.saved || entries.length} تلميذ).`,
      });
    } catch (err: any) {
      console.error('Error saving attendance:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'فشل في حفظ الحضور. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleSaveGrades = async () => {
    if (!selectedSection || !subject.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'يرجى كتابة اسم المادة قبل حفظ الأعداد.',
      });
      return;
    }

    const entries: ResultEntry[] = [];
    students.forEach((s) => {
      const val = scoresState[s.enrollment_id];
      if (val !== undefined && val.trim() !== '') {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 20) {
          entries.push({
            enrollment_id: s.enrollment_id,
            score: parsed,
            max_score: 20,
          });
        }
      }
    });

    if (entries.length === 0) {
      setFeedbackMessage({
        type: 'error',
        text: 'يرجى إدخال عدد واحد على الأقل قبل الحفظ.',
      });
      return;
    }

    setSavingGrades(true);
    setFeedbackMessage(null);

    try {
      const res = await teacherAPI.saveResults(selectedSection.id, subject.trim(), term, entries, true);
      setFeedbackMessage({
        type: 'success',
        text: `تم رصد الأعداد بنجاح (${res.saved || entries.length} تلميذ) في مادة ${subject}.`,
      });
      setScoresState({});
    } catch (err: any) {
      console.error('Error saving grades:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'فشل في رصد الأعداد. يرجى التأكد من الصلاحيات والاتصال.',
      });
    } finally {
      setSavingGrades(false);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!selectedSection || !announcementTitle.trim() || !announcementBody.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'يرجى ملء العنوان وتفاصيل الواجب أو التنبيه.',
      });
      return;
    }

    setSavingAnnouncement(true);
    setFeedbackMessage(null);

    try {
      await teacherAPI.postAnnouncement(
        selectedSection.id,
        announcementTitle.trim(),
        announcementBody.trim(),
        true
      );
      setFeedbackMessage({
        type: 'success',
        text: `تم نشر الواجب / التنبيه بنجاح لقسم ${selectedSection.level} (${selectedSection.name}).`,
      });
      setAnnouncementTitle('');
      setAnnouncementBody('');
    } catch (err: any) {
      console.error('Error posting announcement:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'فشل في نشر التنبيه. يرجى المحاولة لاحقاً.',
      });
    } finally {
      setSavingAnnouncement(false);
    }
  };

  // --- Render ---

  if (loadingSections) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-slate-200 rounded-2xl w-full" />
        <div className="h-48 bg-slate-100 rounded-3xl w-full" />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">لا توجد أقسام مسندة إليك حالياً</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          يرجى التواصل مع إدارة المدرسة لإسناد الأقسام والفصول الدراسية لحسابك الأكاديمي.
        </p>
        <button
          onClick={fetchSections}
          className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة التحقق
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert / Feedback Notification */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-3 transition-all ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Sections Carousel / Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            اختر القسم للعمل عليه:
          </span>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
            {sections.length} أقسام متاحة
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {sections.map((sec) => {
            const isSelected = selectedSection?.id === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 shadow-sm shadow-purple-500/10'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    isSelected ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-500 shadow-2xs'
                  }`}
                >
                  {sec.name}
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                    {sec.level}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    القسم ({sec.name}) • {sec.students_count} تلميذ
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المناداة والحضور</span>
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'grades'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>رصد الأعداد</span>
        </button>
        <button
          onClick={() => setActiveTab('homework')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'homework'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الواجبات والتنبيهات</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs">
        {loadingStudents ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600" />
            <p className="text-xs font-semibold">جاري تحميل قائمة تلاميذ القسم...</p>
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            icon="👥"
            title="لا يوجد تلاميذ مسجلون في هذا القسم"
            message="لم يتم ربط أي تسجيلات نشطة بهذا القسم في قاعدة البيانات بعد."
          />
        ) : (
          <>
            {/* 1. ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      تسجيل الحضور اليومي — {selectedSection?.level} ({selectedSection?.name})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      حدد حالة كل تلميذ ثم اضغط على حفظ الحضور لتثبيتها في المنظومة.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                {/* Roster List */}
                <div className="space-y-2.5">
                  {students.map((student, idx) => {
                    const status = attendanceState[student.enrollment_id] || 'present';
                    return (
                      <div
                        key={student.enrollment_id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{student.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              معرّف التلميذ: {student.student_code}
                            </p>
                          </div>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleAttendanceToggle(student.enrollment_id, 'present')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            حاضر
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceToggle(student.enrollment_id, 'late')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              status === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            متأخر
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceToggle(student.enrollment_id, 'absent')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            غائب
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={savingAttendance}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {savingAttendance ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        جاري الحفظ في المنظومة...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        حفظ تسجيل الحضور ({students.length} تلميذ)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 2. GRADES TAB */}
            {activeTab === 'grades' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    رصد الأعداد والتقييمات — {selectedSection?.level} ({selectedSection?.name})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    الأعداد تُسجل على 20 نقطة وتُنشر مباشرة لأولياء التلاميذ بعد الحفظ.
                  </p>
                </div>

                {/* Form Inputs for Subject and Term */}
                <div className="grid gap-3 sm:grid-cols-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">المادة التعليمية</label>
                    <input
                      type="text"
                      placeholder="مثل: الرياضيات، القراءة، الفرنسية..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">الفترة / الثلاثي</label>
                    <select
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600"
                    >
                      <option value="الثلاثي الأول">الثلاثي الأول</option>
                      <option value="الثلاثي الثاني">الثلاثي الثاني</option>
                      <option value="الثلاثي الثالث">الثلاثي الثالث</option>
                    </select>
                  </div>
                </div>

                {/* Scores Input Table */}
                <div className="space-y-2">
                  {students.map((student, idx) => (
                    <div
                      key={student.enrollment_id}
                      className="flex items-center justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 text-slate-400 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-800">{student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="/20"
                          min="0"
                          max="20"
                          step="0.25"
                          value={scoresState[student.enrollment_id] || ''}
                          onChange={(e) =>
                            setScoresState((prev) => ({
                              ...prev,
                              [student.enrollment_id]: e.target.value,
                            }))
                          }
                          className="w-24 p-2 bg-white border border-slate-200 rounded-xl font-black text-center text-purple-700 text-sm outline-none focus:border-purple-600"
                        />
                        <span className="text-xs font-bold text-slate-400">/ 20</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleSaveGrades}
                    disabled={savingGrades}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {savingGrades ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        جاري رصد الأعداد في المنظومة...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        رصد الأعداد وإرسالها للنظام
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 3. HOMEWORK & ANNOUNCEMENT TAB */}
            {activeTab === 'homework' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    نشر واجب منزلي أو تنبيه — {selectedSection?.level} ({selectedSection?.name})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    سيصل هذا الإعلان مباشرة لجميع أولياء أمور تلاميذ هذا القسم عبر لوحة التحكم وتطبيق الجوال.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      عنوان الواجب أو التنبيه
                    </label>
                    <input
                      type="text"
                      placeholder="مثل: واجب الرياضيات - تمارين الصفحة 45"
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      تفاصيل الواجب أو نص التنبيه
                    </label>
                    <textarea
                      rows={5}
                      placeholder="اكتب هنا التوجيهات، أرقام التمارين، وتاريخ التسليم المطلوب من التلاميذ..."
                      value={announcementBody}
                      onChange={(e) => setAnnouncementBody(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-purple-600 resize-none"
                    />
                  </div>

                  <button
                    onClick={handlePostAnnouncement}
                    disabled={savingAnnouncement}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {savingAnnouncement ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        جاري النشر والإرسال للأولياء...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        نشر الواجب للقسم وإشعار الأولياء
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
