import { LearningPath, LevelName, DocumentCategory, LearningPathName } from './types';

export const UI_STRINGS = {
  appName: "CMS Tài liệu khóa học",
  home: "Trang chủ",
  learningPaths: "Lộ trình học",
  courses: "Các khóa học",
  levels: "Cấp độ",
  filterBy: "Lọc theo",
  ageGroup: "Độ tuổi",
  programmingLanguage: "Ngôn ngữ lập trình",
  tools: "Công cụ",
  login: "Đăng nhập",
  logout: "Đăng xuất",
  adminLogin: "Đăng nhập Admin",
  username: "Tên đăng nhập",
  password: "Mật khẩu",
  welcomeMessage: "MindX K12 - CMS",
  selectPathHint: "Chọn một lộ trình học từ thanh bên để xem chi tiết.",
  courseContent: "Nội dung khóa học", 
  courseObjectives: "Mục tiêu khóa học",
  levelContent: "Nội dung cấp độ",
  levelObjectives: "Mục tiêu cấp độ",
  documents: "Tài liệu",
  all: "Tất cả",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  add: "Thêm",
  save: "Lưu",
  cancel: "Hủy",
  addCourse: "Thêm khóa học",
  addLevel: "Thêm cấp độ",
  addDocument: "Thêm tài liệu",
  deleteConfirmation: "Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.",
  name: "Tên",
  content: "Nội dung",
  objectives: "Mục tiêu",
  url: "Đường dẫn (URL)",
  year: "Năm",
  ageGroupLabel: "Độ tuổi",
  language: "Ngôn ngữ lập trình",
  toolsLabel: "Công cụ (phân cách bởi dấu phẩy)",
  category: "Lộ trình",
  level: "Cấp độ",
  homeTitle: "MindX Technology School - CMS",
  homeSubtitle: "Hệ thống quản lý và chia sẻ tài liệu liên quan đến Khóa học tại MindX.",
  codingAiDesc: "Từ những khối lệnh đầu tiên đến khoa học máy tính và trí tuệ nhân tạo.",
  artDesignDesc: "Giải phóng sự sáng tạo với các công cụ thiết kế kỹ thuật số và nghệ thuật.",
  roboticsDesc: "Xây dựng và lập trình robot để giải quyết các vấn đề trong thế giới thực.",
  searchPlaceholder: "Tìm kiếm khóa học, tài liệu...",
  contact: "Liên hệ",
  contactPhone: "0944.022.507",
  contactEmail: "academic@mindx.vn",
};

export const DOCUMENT_NAMES: { [key in DocumentCategory]: string } = {
  [DocumentCategory.ROADMAP]: 'Roadmap',
  [DocumentCategory.SYLLABUS]: 'Syllabus',
  [DocumentCategory.TRIAL]: 'Kịch bản Trial',
  [DocumentCategory.LESSON_PLAN]: 'Lesson Plan',
  [DocumentCategory.TEACHING_GUIDE]: 'Teaching Guide',
  [DocumentCategory.SLIDE]: 'Slide',
  [DocumentCategory.PROJECT]: 'Project/Sample',
  [DocumentCategory.HOMEWORK]: 'Homework',
  [DocumentCategory.CHECKPOINT]: 'Checkpoint',
  [DocumentCategory.STUDENT_BOOK]: 'Student Book',
};


export const INITIAL_DATA: LearningPath[] = [
  {
    id: 'lp-art',
    name: LearningPathName.ART_DESIGN,
    documents: [{ id: 'doc-art-roadmap', category: DocumentCategory.ROADMAP, name: 'Lộ trình Art & Design', url: '#' }],
    courses: [
      { id: 'c-art-0', year: 0, name: 'Little Artist', ageGroup: '4+', tools: ['Màu vẽ'], content: 'Khóa học làm quen với màu sắc và hình khối cơ bản.', objectives: 'Nhận biết màu sắc, phát triển khả năng sáng tạo.', documents: [{ id: 'doc-art-0-syl', category: DocumentCategory.SYLLABUS, name: 'Giáo trình Little Artist', url: '#' }], levels: [
          { id: 'l-art-0-b', name: LevelName.BASIC, content: 'Nội dung cơ bản...', objectives: 'Mục tiêu cơ bản...', documents: [] },
          { id: 'l-art-0-a', name: LevelName.ADVANCED, content: 'Nội dung nâng cao...', objectives: 'Mục tiêu nâng cao...', documents: [] },
          { id: 'l-art-0-i', name: LevelName.INTENSIVE, content: 'Nội dung chuyên sâu...', objectives: 'Mục tiêu chuyên sâu...', documents: [] },
      ]},
      { id: 'c-art-1', year: 1, name: 'KidsArt', ageGroup: '6+', tools: ['Đất nặn', 'Giấy thủ công'], content: 'Khóa học phát triển tư duy tạo hình.', objectives: 'Tạo ra các sản phẩm thủ công đơn giản.', documents: [], levels: [
        { id: 'l-art-1-b', name: LevelName.BASIC, content: 'Nội dung cơ bản...', objectives: 'Mục tiêu cơ bản...', documents: [
            { id: 'doc-art-1b-lp', category: DocumentCategory.LESSON_PLAN, name: 'Kế hoạch bài 1', url: '#' }
        ] },
        { id: 'l-art-1-a', name: LevelName.ADVANCED, content: 'Nội dung nâng cao...', objectives: 'Mục tiêu nâng cao...', documents: [] },
        { id: 'l-art-1-i', name: LevelName.INTENSIVE, content: 'Nội dung chuyên sâu...', objectives: 'Mục tiêu chuyên sâu...', documents: [] },
      ]},
      { id: 'c-art-5', year: 5, name: 'Graphic Design', ageGroup: '12+', tools: ['Adobe Illustrator', 'Photoshop'], content: 'Nhập môn thiết kế đồ họa.', objectives: 'Sử dụng thành thạo công cụ, tạo ra sản phẩm thiết kế.', documents: [], levels: [
        { id: 'l-art-5-b', name: LevelName.BASIC, content: 'Nội dung cơ bản...', objectives: 'Mục tiêu cơ bản...', documents: [
            { id: 'doc-art-5b-sl', category: DocumentCategory.SLIDE, name: 'Bài giảng Photoshop', url: '#' },
            { id: 'doc-art-5b-hw', category: DocumentCategory.HOMEWORK, name: 'Bài tập về nhà 1', url: '#' },
        ] },
        { id: 'l-art-5-a', name: LevelName.ADVANCED, content: 'Nội dung nâng cao...', objectives: 'Mục tiêu nâng cao...', documents: [] },
        { id: 'l-art-5-i', name: LevelName.INTENSIVE, content: 'Nội dung chuyên sâu...', objectives: 'Mục tiêu chuyên sâu...', documents: [] },
      ]},
    ],
  },
  {
    id: 'lp-coding',
    name: LearningPathName.CODING_AI,
    documents: [{ id: 'doc-coding-roadmap', category: DocumentCategory.ROADMAP, name: 'Lộ trình Coding & AI', url: '#' }],
    courses: [
      { id: 'c-code-1', year: 1, name: 'Scratch Creator', ageGroup: '10+', language: 'Scratch', content: 'Lập trình kéo thả với Scratch.', objectives: 'Tạo ra các dự án game, hoạt hình đơn giản.', documents: [{ id: 'doc-code-1-trial', category: DocumentCategory.TRIAL, name: 'Học thử Scratch', url: '#' }], levels: [
        { id: 'l-code-1-b', name: LevelName.BASIC, content: 'Các khối lệnh cơ bản.', objectives: 'Hiểu về vòng lặp, điều kiện.', documents: [
            { id: 'doc-code-1b-guide', category: DocumentCategory.TEACHING_GUIDE, name: 'HDGD Scratch cơ bản', url: '#' },
            { id: 'doc-code-1b-proj', category: DocumentCategory.PROJECT, name: 'Dự án Mèo đuổi chuột', url: '#' },
        ]},
        { id: 'l-code-1-a', name: LevelName.ADVANCED, content: 'Các khái niệm nâng cao.', objectives: 'Sử dụng biến, danh sách, tin nhắn.', documents: [] },
        { id: 'l-code-1-i', name: LevelName.INTENSIVE, content: 'Tối ưu hóa và dự án lớn.', objectives: 'Xây dựng game phức tạp.', documents: [] },
      ]},
      { id: 'c-code-4', year: 4, name: 'Web Developer', ageGroup: '13+', language: 'JavaScript', tools: ['VS Code', 'HTML', 'CSS'], content: 'Xây dựng website từ A-Z.', objectives: 'Nắm vững HTML, CSS, JS, tạo trang web tương tác.', documents: [], levels: [
        { id: 'l-code-4-b', name: LevelName.BASIC, content: 'Nội dung cơ bản...', objectives: 'Mục tiêu cơ bản...', documents: [] },
        { id: 'l-code-4-a', name: LevelName.ADVANCED, content: 'Nội dung nâng cao...', objectives: 'Mục tiêu nâng cao...', documents: [] },
        { id: 'l-code-4-i', name: LevelName.INTENSIVE, content: 'Nội dung chuyên sâu...', objectives: 'Mục tiêu chuyên sâu...', documents: [] },
      ]},
    ],
  },
  {
    id: 'lp-robotics',
    name: LearningPathName.ROBOTICS,
    documents: [{ id: 'doc-robotics-roadmap', category: DocumentCategory.ROADMAP, name: 'Lộ trình Robotics', url: '#' }],
    courses: [
      { id: 'c-robo-1', year: 1, name: 'Intro to Robotics', ageGroup: '6+', tools: ['VEXcode', 'Lego Mindstorms'], content: 'Lắp ráp và lập trình robot cơ bản.', objectives: 'Hiểu nguyên lý hoạt động của robot, lập trình robot di chuyển.', documents: [], levels: [
        { id: 'l-robo-1-b', name: LevelName.BASIC, content: 'Nội dung cơ bản...', objectives: 'Mục tiêu cơ bản...', documents: [
            { id: 'doc-robo-1b-check', category: DocumentCategory.CHECKPOINT, name: 'Kiểm tra cuối kỳ', url: '#' },
            { id: 'doc-robo-1b-book', category: DocumentCategory.STUDENT_BOOK, name: 'Sách học viên VEX', url: '#' },
        ]},
        { id: 'l-robo-1-a', name: LevelName.ADVANCED, content: 'Nội dung nâng cao...', objectives: 'Mục tiêu nâng cao...', documents: [] },
        { id: 'l-robo-1-i', name: LevelName.INTENSIVE, content: 'Nội dung chuyên sâu...', objectives: 'Mục tiêu chuyên sâu...', documents: [] },
      ]},
      { id: 'c-robo-3', year: 3, name: 'Creative Robotics', ageGroup: '10+', tools: ['VEXcode', 'Arduino'], content: 'Sáng tạo các giải pháp robot.', objectives: 'Giải quyết vấn đề thực tế bằng robot.', documents: [], levels: [
        { id: 'l-robo-3-b', name: LevelName.BASIC, content: 'Nội dung cơ bản...', objectives: 'Mục tiêu cơ bản...', documents: [] },
        { id: 'l-robo-3-a', name: LevelName.ADVANCED, content: 'Nội dung nâng cao...', objectives: 'Mục tiêu nâng cao...', documents: [] },
        { id: 'l-robo-3-i', name: LevelName.INTENSIVE, content: 'Nội dung chuyên sâu...', objectives: 'Mục tiêu chuyên sâu...', documents: [] },
      ]},
    ],
  },
];