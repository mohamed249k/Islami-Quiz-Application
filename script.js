// Islamic Quiz Application - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const difficultyCards = document.querySelectorAll('.difficulty-card');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options-container');
    const prevQuestionBtn = document.getElementById('prev-question');
    const nextQuestionBtn = document.getElementById('next-question');
    const submitQuizBtn = document.getElementById('submit-quiz');
    const questionCounter = document.getElementById('question-counter');
    const progressFill = document.getElementById('progress-fill');
    const timerElement = document.getElementById('timer');
    const currentLevelElement = document.getElementById('current-level');
    const scoreValueElement = document.getElementById('score-value');
    const percentageElement = document.getElementById('percentage');
    const resultLevelElement = document.getElementById('result-level');
    const timeTakenElement = document.getElementById('time-taken');
    const resultTitleElement = document.getElementById('result-title');
    const resultDescriptionElement = document.getElementById('result-description');
    const restartQuizBtn = document.getElementById('restart-quiz');
    const chooseLevelBtn = document.getElementById('choose-level');
    const progressRingCircle = document.querySelector('.progress-ring-circle');
    
    // Quiz State Variables
    let currentLevel = 'easy';
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let score = 0;
    let quizStarted = false;
    let timerInterval;
    let timeRemaining = 600; // 10 minutes in seconds
    let startTime;
    
    // Questions Database (60 questions total - 20 per level)
    const questions = {
        easy: [
            {
                question: "كم عدد أركان الإسلام؟",
                options: ["ثلاثة", "أربعة", "خمسة", "ستة"],
                correctAnswer: 2,
                explanation: "أركان الإسلام خمسة: الشهادتان، إقام الصلاة، إيتاء الزكاة، صوم رمضان، وحج البيت لمن استطاع إليه سبيلا."
            },
            {
                question: "ما هو أول أركان الإسلام؟",
                options: ["الصلاة", "الصوم", "الشهادتان", "الزكاة"],
                correctAnswer: 2,
                explanation: "أول أركان الإسلام هو الشهادتان: أشهد أن لا إله إلا الله وأشهد أن محمدًا رسول الله."
            },
            {
                question: "كم عدد الصلوات المفروضة في اليوم والليلة؟",
                options: ["ثلاث", "أربع", "خمس", "ست"],
                correctAnswer: 2,
                explanation: "الصلوات المفروضة خمس: الفجر، الظهر، العصر، المغرب، العشاء."
            },
            {
                question: "ما هو شهر الصوم في الإسلام؟",
                options: ["شعبان", "رمضان", "محرم", "رجب"],
                correctAnswer: 1,
                explanation: "شهر الصوم في الإسلام هو شهر رمضان المبارك، وهو الشهر التاسع من التقويم الهجري."
            },
            {
                question: "ما هي قبلة المسلمين؟",
                options: ["المسجد الأقصى", "الكعبة", "المسجد النبوي", "مسجد قباء"],
                correctAnswer: 1,
                explanation: "قبلة المسلمين هي الكعبة المشرفة في مكة المكرمة."
            },
            {
                question: "من هو آخر الأنبياء والمرسلين؟",
                options: ["موسى عليه السلام", "عيسى عليه السلام", "محمد صلى الله عليه وسلم", "إبراهيم عليه السلام"],
                correctAnswer: 2,
                explanation: "آخر الأنبياء والمرسلين هو محمد بن عبد الله صلى الله عليه وسلم."
            },
            {
                question: "ما هو الكتاب المنزل على النبي محمد صلى الله عليه وسلم؟",
                options: ["الإنجيل", "الزبور", "التوراة", "القرآن الكريم"],
                correctAnswer: 3,
                explanation: "الكتاب المنزل على النبي محمد صلى الله عليه وسلم هو القرآن الكريم."
            },
            {
                question: "كم عدد أركان الإيمان؟",
                options: ["خمسة", "ستة", "سبعة", "ثمانية"],
                correctAnswer: 1,
                explanation: "أركان الإيمان ستة: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره."
            },
            {
                question: "ما هي السورة التي تسمى قلب القرآن؟",
                options: ["سورة الفاتحة", "سورة البقرة", "سورة يس", "سورة الرحمن"],
                correctAnswer: 2,
                explanation: "سورة يس تسمى قلب القرآن كما ورد في بعض الأحاديث."
            },
            {
                question: "من هو أول رسول أرسله الله إلى البشر؟",
                options: ["آدم عليه السلام", "نوح عليه السلام", "إدريس عليه السلام", "هود عليه السلام"],
                correctAnswer: 1,
                explanation: "أول رسول أرسله الله إلى البشر هو نوح عليه السلام."
            },
            {
                question: "ما هي أعظم سورة في القرآن الكريم؟",
                options: ["سورة البقرة", "سورة الإخلاص", "سورة الفاتحة", "سورة الكهف"],
                correctAnswer: 2,
                explanation: "أعظم سورة في القرآن هي سورة الفاتحة، وتسمى أيضًا أم الكتاب."
            },
            {
                question: "ما هي الصلاة التي يركع فيها المصلي أربع مرات ويسجد أربع مرات؟",
                options: ["صلاة الظهر", "صلاة العصر", "صلاة المغرب", "صلاة الكسوف"],
                correctAnswer: 3,
                explanation: "صلاة الكسوف هي التي يركع فيها المصلي أربع مرات ويسجد أربع مرات."
            },
            {
                question: "كم عدد سنوات نزول القرآن الكريم؟",
                options: ["10 سنوات", "15 سنة", "23 سنة", "30 سنة"],
                correctAnswer: 2,
                explanation: "نزل القرآن الكريم على النبي محمد صلى الله عليه وسلم على مدى 23 سنة."
            },
            {
                question: "ما هي أول آية نزلت من القرآن الكريم؟",
                options: ["﴿يَا أَيُّهَا الْمُدَّثِّرُ﴾", "﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾", "﴿الم﴾", "﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾"],
                correctAnswer: 1,
                explanation: "أول آية نزلت من القرآن هي: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾ من سورة العلق."
            },
            {
                question: "ما هو اليوم الذي خلق فيه آدم عليه السلام؟",
                options: ["الاثنين", "الجمعة", "الخميس", "الأحد"],
                correctAnswer: 1,
                explanation: "خلق آدم عليه السلام يوم الجمعة، كما ورد في الحديث الصحيح."
            },
            {
                question: "ما هي السورة التي لم تبدأ بالبسملة؟",
                options: ["سورة التوبة", "سورة النمل", "سورة الفاتحة", "سورة الناس"],
                correctAnswer: 0,
                explanation: "سورة التوبة هي السورة الوحيدة في القرآن التي لم تبدأ بالبسملة."
            },
            {
                question: "من هي أم المؤمنين التي تسمى الصديقة بنت الصديق؟",
                options: ["عائشة رضي الله عنها", "خديجة رضي الله عنها", "حفصة رضي الله عنها", "زينب رضي الله عنها"],
                correctAnswer: 0,
                explanation: "عائشة رضي الله عنها تسمى الصديقة بنت الصديق (أبي بكر الصديق)."
            },
            {
                question: "ما هو عدد آيات سورة الفاتحة؟",
                options: ["5 آيات", "6 آيات", "7 آيات", "8 آيات"],
                correctAnswer: 2,
                explanation: "سورة الفاتحة تتكون من 7 آيات."
            },
            {
                question: "من هو الصحابي الملقب بسيف الله المسلول؟",
                options: ["عمر بن الخطاب", "علي بن أبي طالب", "خالد بن الوليد", "حمزة بن عبد المطلب"],
                correctAnswer: 2,
                explanation: "خالد بن الوليد رضي الله عنه هو الملقب بسيف الله المسلول."
            },
            {
                question: "ما هو الحيوان الذي تحدث في القرآن الكريم؟",
                options: ["النملة", "الفيل", "الغراب", "كل ما سبق"],
                correctAnswer: 3,
                explanation: "جميع ما سبق من الحيوانات تم ذكرها في القرآن الكريم."
            }
        ],
        medium: [
            {
                question: "من هو النبي الذي سمي بخليل الله؟",
                options: ["موسى عليه السلام", "إبراهيم عليه السلام", "محمد صلى الله عليه وسلم", "عيسى عليه السلام"],
                correctAnswer: 1,
                explanation: "النبي إبراهيم عليه السلام هو خليل الله (صديق الله)."
            },
            {
                question: "ما هي السورة التي تسمى بسورة النبي؟",
                options: ["سورة محمد", "سورة التحريم", "سورة الأحزاب", "سورة النور"],
                correctAnswer: 0,
                explanation: "سورة محمد تسمى بسورة النبي صلى الله عليه وسلم."
            },
            {
                question: "كم عدد المرات التي ذكر فيها اسم النبي عيسى عليه السلام في القرآن؟",
                options: ["25 مرة", "20 مرة", "15 مرة", "10 مرات"],
                correctAnswer: 0,
                explanation: "ذكر اسم عيسى عليه السلام في القرآن 25 مرة."
            },
            {
                question: "ما هي الغزوة التي وقعت في شهر رمضان؟",
                options: ["غزوة بدر", "غزوة أحد", "غزوة الخندق", "فتح مكة"],
                correctAnswer: 0,
                explanation: "غزوة بدر الكبرى وقعت في شهر رمضان من السنة الثانية للهجرة."
            },
            {
                question: "من هو أول من أسلم من الصبيان؟",
                options: ["علي بن أبي طالب", "الزبير بن العوام", "عبد الله بن مسعود", "زيد بن حارثة"],
                correctAnswer: 0,
                explanation: "علي بن أبي طالب رضي الله عنه هو أول من أسلم من الصبيان."
            },
            {
                question: "ما هي الصلاة التي ليس لها ركوع ولا سجود؟",
                options: ["صلاة الجنازة", "صلاة الاستسقاء", "صلاة الكسوف", "صلاة الوتر"],
                correctAnswer: 0,
                explanation: "صلاة الجنازة هي الصلاة التي ليس لها ركوع ولا سجود."
            },
            {
                question: "كم عدد أحزاب القرآن الكريم؟",
                options: ["30 حزبًا", "60 حزبًا", "120 حزبًا", "240 حزبًا"],
                correctAnswer: 1,
                explanation: "القرآن الكريم مقسم إلى 60 حزبًا."
            },
            {
                question: "ما هي السورة التي تسمى عروس القرآن؟",
                options: ["سورة البقرة", "سورة الرحمن", "سورة ياسين", "سورة الفرقان"],
                correctAnswer: 1,
                explanation: "سورة الرحمن تسمى عروس القرآن."
            },
            {
                question: "من هو الصحابي الذي اهتز لموته عرش الرحمن؟",
                options: ["عمر بن الخطاب", "عثمان بن عفان", "سعد بن معاذ", "خالد بن الوليد"],
                correctAnswer: 2,
                explanation: "الصحابي سعد بن معاذ رضي الله عنه اهتز لموته عرش الرحمن."
            },
            {
                question: "ما هو أول مسجد بني في الإسلام؟",
                options: ["المسجد الحرام", "المسجد النبوي", "مسجد قباء", "المسجد الأقصى"],
                correctAnswer: 2,
                explanation: "أول مسجد بني في الإسلام هو مسجد قباء في المدينة المنورة."
            },
            {
                question: "من هو النبي الذي لقب بكليم الله؟",
                options: ["إبراهيم عليه السلام", "موسى عليه السلام", "داوود عليه السلام", "يوسف عليه السلام"],
                correctAnswer: 1,
                explanation: "النبي موسى عليه السلام هو كليم الله."
            },
            {
                question: "ما هي أطول سورة في القرآن الكريم؟",
                options: ["سورة البقرة", "سورة النساء", "سورة آل عمران", "سورة الأعراف"],
                correctAnswer: 0,
                explanation: "أطول سورة في القرآن هي سورة البقرة (286 آية)."
            },
            {
                question: "من هي المرأة التي ذكر اسمها في القرآن صراحة؟",
                options: ["خديجة", "عائشة", "مريم", "فاطمة"],
                correctAnswer: 2,
                explanation: "مريم بنت عمران هي المرأة الوحيدة التي ذكر اسمها صراحة في القرآن."
            },
            {
                question: "كم عدد السنوات التي عاشها النبي صلى الله عليه وسلم في مكة بعد البعثة؟",
                options: ["10 سنوات", "13 سنة", "15 سنة", "20 سنة"],
                correctAnswer: 1,
                explanation: "عاش النبي صلى الله عليه وسلم في مكة بعد البعثة 13 سنة."
            },
            {
                question: "ما هو عدد أبواب الجنة؟",
                options: ["7 أبواب", "8 أبواب", "9 أبواب", "10 أبواب"],
                correctAnswer: 1,
                explanation: "للجنة ثمانية أبواب كما ورد في الأحاديث الصحيحة."
            },
            {
                question: "من هو النبي الذي صام أول مرة؟",
                options: ["آدم عليه السلام", "نوح عليه السلام", "داوود عليه السلام", "محمد صلى الله عليه وسلم"],
                correctAnswer: 1,
                explanation: "النبي نوح عليه السلام هو أول من صام."
            },
            {
                question: "ما هي السورة التي تسمى بني إسرائيل؟",
                options: ["سورة النمل", "سورة الإسراء", "سورة مريم", "سورة طه"],
                correctAnswer: 1,
                explanation: "سورة الإسراء تسمى أيضًا سورة بني إسرائيل."
            },
            {
                question: "كم عدد السور المكية في القرآن؟",
                options: ["76 سورة", "82 سورة", "86 سورة", "90 سورة"],
                correctAnswer: 2,
                explanation: "عدد السور المكية 86 سورة."
            },
            {
                question: "من هو أول من جهر بالقرآن الكريم في مكة؟",
                options: ["أبو بكر الصديق", "عمر بن الخطاب", "عبد الله بن مسعود", "بلال بن رباح"],
                correctAnswer: 2,
                explanation: "عبد الله بن مسعود رضي الله عنه هو أول من جهر بالقرآن في مكة."
            },
            {
                question: "ما هي الصلاة التي يشرع فيها الجهر بالقراءة؟",
                options: ["صلاة الظهر والعصر", "صلاة الفجر والمغرب والعشاء", "صلاة الضحى", "صلاة الوتر"],
                correctAnswer: 1,
                explanation: "يشرع الجهر بالقراءة في صلاة الفجر والمغرب والعشاء."
            }
        ],
        hard: [
            {
                question: "من هو الصحابي الذي دفن داخل الكعبة؟",
                options: ["عبد الله بن الزبير", "عبد المطلب", "أبو طالب", "وليد بن المغيرة"],
                correctAnswer: 0,
                explanation: "عبد الله بن الزبير رضي الله عنه هو من دفن داخل الكعبة."
            },
            {
                question: "ما هي السورة التي تسمى سورة الحواريين؟",
                options: ["سورة الصف", "سورة المائدة", "سورة آل عمران", "سورة التوبة"],
                correctAnswer: 0,
                explanation: "سورة الصف تسمى سورة الحواريين."
            },
            {
                question: "كم عدد المرات التي ذكرت فيها كلمة 'الشهر' في القرآن الكريم؟",
                options: ["12 مرة", "24 مرة", "36 مرة", "48 مرة"],
                correctAnswer: 0,
                explanation: "ذكرت كلمة 'الشهر' في القرآن الكريم 12 مرة."
            },
            {
                question: "من هو الصحابي الذي تمنى الموت شهيدًا فاستشهد؟",
                options: ["سعد بن أبي وقاص", "طلحة بن عبيد الله", "عمران بن حصين", "أبو أيوب الأنصاري"],
                correctAnswer: 3,
                explanation: "أبو أيوب الأنصاري رضي الله عنه تمنى الموت شهيدًا فاستشهد في حصار القسطنطينية."
            },
            {
                question: "ما هي السورة التي نزلت في جوف الكعبة؟",
                options: ["سورة الفتح", "سورة النجم", "سورة الإخلاص", "سورة التين"],
                correctAnswer: 1,
                explanation: "سورة النجم نزلت في جوف الكعبة."
            },
            {
                question: "من هو النبي الذي قتل جالوت؟",
                options: ["شعيب عليه السلام", "داوود عليه السلام", "سليمان عليه السلام", "يوشع بن نون"],
                correctAnswer: 1,
                explanation: "النبي داوود عليه السلام هو الذي قتل جالوت."
            },
            {
                question: "ما هو عدد آيات سورة الكوثر؟",
                options: ["3 آيات", "4 آيات", "5 آيات", "6 آيات"],
                correctAnswer: 0,
                explanation: "سورة الكوثر هي أقصر سورة في القرآن وتتكون من 3 آيات فقط."
            },
            {
                question: "من هو أول من كتب 'بسم الله الرحمن الرحيم'؟",
                options: ["النبي سليمان عليه السلام", "النبي داوود عليه السلام", "النبي إبراهيم عليه السلام", "النبي آدم عليه السلام"],
                correctAnswer: 0,
                explanation: "أول من كتب 'بسم الله الرحمن الرحيم' هو النبي سليمان عليه السلام في كتابه إلى بلقيس."
            },
            {
                question: "ما هي الغزوة التي حدثت فيها معجزة انشقاق القمر؟",
                options: ["غزوة بدر", "غزوة أحد", "غزوة بني النضير", "غزوة الطائف"],
                correctAnswer: 2,
                explanation: "معجزة انشقاق القمر حدثت قبل غزوة بني النضير."
            },
            {
                question: "من هو الصحابي الذي حفظ القرآن الكريم في عهد النبي صلى الله عليه وسلم؟",
                options: ["أبو بكر الصديق", "عمر بن الخطاب", "زيد بن ثابت", "معاذ بن جبل"],
                correctAnswer: 2,
                explanation: "زيد بن ثابت رضي الله عنه هو من حفظ القرآن الكريم في عهد النبي صلى الله عليه وسلم."
            },
            {
                question: "ما هي السورة التي تسمى المنجية؟",
                options: ["سورة الملك", "سورة الواقعة", "سورة الدخان", "سورة السجدة"],
                correctAnswer: 0,
                explanation: "سورة الملك تسمى المنجية من عذاب القبر."
            },
            {
                question: "من هو النبي الذي رأى ذبح ابنه في المنام؟",
                options: ["إبراهيم عليه السلام", "إسماعيل عليه السلام", "إسحاق عليه السلام", "يعقوب عليه السلام"],
                correctAnswer: 0,
                explanation: "النبي إبراهيم عليه السلام هو الذي رأى في المنام أنه يذبح ابنه إسماعيل."
            },
            {
                question: "ما هي الصلاة التي يقرأ فيها الإمام سورة الأعلى وسورة الغاشية؟",
                options: ["صلاة العيد", "صلاة الجمعة", "صلاة الكسوف", "صلاة الاستسقاء"],
                correctAnswer: 1,
                explanation: "في صلاة الجمعة يقرأ الإمام في الركعة الأولى سورة الأعلى وفي الثانية سورة الغاشية."
            },
            {
                question: "من هو الصحابي الذي شهد له النبي صلى الله عليه وسلم بالجنة ولم يسلم إلا يوم الفتح؟",
                options: ["سعيد بن زيد", "عكرمة بن أبي جهل", "العباس بن عبد المطلب", "أبو سفيان بن الحارث"],
                correctAnswer: 1,
                explanation: "عكرمة بن أبي جهل رضي الله عنه شهد له النبي بالجنة ولم يسلم إلا يوم فتح مكة."
            },
            {
                question: "ما هي السورة التي تسمى الفاضحة؟",
                options: ["سورة التوبة", "سورة النور", "سورة الحجرات", "سورة المجادلة"],
                correctAnswer: 3,
                explanation: "سورة المجادلة تسمى الفاضحة لأنها فضحت المنافقين."
            },
            {
                question: "من هو النبي الذي كان يصوم يومًا ويفطر يومًا؟",
                options: ["داوود عليه السلام", "أيوب عليه السلام", "يونس عليه السلام", "زكريا عليه السلام"],
                correctAnswer: 0,
                explanation: "النبي داوود عليه السلام كان يصوم يومًا ويفطر يومًا."
            },
            {
                question: "ما هي السورة التي ليس فيها حرف الميم؟",
                options: ["سورة الكوثر", "سورة الإخلاص", "سورة الفلق", "سورة الناس"],
                correctAnswer: 0,
                explanation: "سورة الكوثر هي السورة الوحيدة في القرآن التي ليس فيها حرف الميم."
            },
            {
                question: "من هو أول من أذن في السماء؟",
                options: ["جبريل عليه السلام", "ميكائيل عليه السلام", "إسرافيل عليه السلام", "رضوان عليه السلام"],
                correctAnswer: 0,
                explanation: "جبريل عليه السلام هو أول من أذن في السماء."
            },
            {
                question: "ما هي السورة التي تسمى سنام القرآن؟",
                options: ["سورة البقرة", "سورة الإسراء", "سورة البقرة", "سورة الفرقان"],
                correctAnswer: 0,
                explanation: "سورة البقرة تسمى سنام القرآن لأنها أطول سورة."
            },
            {
                question: "من هو الصحابي الذي شرب دم النبي صلى الله عليه وسلم؟",
                options: ["علي بن أبي طالب", "عبد الله بن الزبير", "ثابت بن الدحداح", "لا أحد"],
                correctAnswer: 3,
                explanation: "لم يشرب أحد دم النبي صلى الله عليه وسلم، لكن في غزوة أحد عندما أصيب النبي وشج رأسه، قام علي بن أبي طالب بغسل الدم عنه."
            }
        ]
    };
    
    // Level Names in Arabic
    const levelNames = {
        easy: "سهل",
        medium: "متوسط",
        hard: "صعب"
    };
    
    // Result Messages based on score
    const resultMessages = {
        excellent: {
            title: "ممتاز جدًا!",
            description: "معلوماتك الإسلامية قوية وممتازة، استمر في طلب العلم والاستزادة من المعرفة."
        },
        veryGood: {
            title: "جيد جدًا!",
            description: "أداؤك جيد جدًا، لديك معرفة إسلامية جيدة، واصل التعلم لترتقي أكثر."
        },
        good: {
            title: "جيد!",
            description: "أداؤك جيد، لكن هناك مجال للتحسين، واصل القراءة والاطلاع لتعزيز معلوماتك."
        },
        average: {
            title: "مقبول",
            description: "معلوماتك مقبولة ولكن تحتاج إلى مزيد من الجهد والمراجعة لتطوير معرفتك الإسلامية."
        },
        weak: {
            title: "تحتاج إلى مراجعة",
            description: "يبدو أن معلوماتك الإسلامية تحتاج إلى مراجعة وتعزيز، ابدأ بقراءة الكتب الأساسية وحضور الدروس."
        }
    };
    
    // Initialize the application
    function initApp() {
        // Set up event listeners for difficulty cards
        difficultyCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all cards
                difficultyCards.forEach(c => c.classList.remove('active'));
                // Add active class to selected card
                this.classList.add('active');
                // Set current level
                currentLevel = this.getAttribute('data-level');
                // Update level display
                currentLevelElement.textContent = levelNames[currentLevel];
            });
        });
        
        // Set default level to easy
        document.querySelector('.difficulty-card.easy').classList.add('active');
        
        // Start quiz button event listener
        startQuizBtn.addEventListener('click', startQuiz);
        
        // Navigation buttons event listeners
        prevQuestionBtn.addEventListener('click', showPreviousQuestion);
        nextQuestionBtn.addEventListener('click', showNextQuestion);
        submitQuizBtn.addEventListener('click', submitQuiz);
        
        // Results screen buttons event listeners
        restartQuizBtn.addEventListener('click', restartQuiz);
        chooseLevelBtn.addEventListener('click', chooseLevel);
        
        // Initialize user answers array
        resetQuiz();
    }
    
    // Reset quiz state
    function resetQuiz() {
        currentQuestionIndex = 0;
        userAnswers = new Array(questions[currentLevel].length).fill(null);
        score = 0;
        quizStarted = false;
        timeRemaining = 600; // 10 minutes
        startTime = null;
        
        // Clear timer interval if exists
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    }
    
    // Start the quiz
    function startQuiz() {
        if (!currentLevel) return;
        
        resetQuiz();
        
        // Switch to quiz screen
        welcomeScreen.classList.remove('active');
        quizScreen.classList.add('active');
        resultsScreen.classList.remove('active');
        
        // Initialize quiz
        loadQuestion();
        updateProgress();
        startTimer();
        
        quizStarted = true;
        startTime = new Date();
    }
    
    // Load the current question
    function loadQuestion() {
        const currentQuestion = questions[currentLevel][currentQuestionIndex];
        
        // Set question text
        questionText.textContent = currentQuestion.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create option elements
        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            // Check if user has already answered this question
            if (userAnswers[currentQuestionIndex] !== null) {
                optionElement.classList.add('disabled');
                
                // Mark correct/wrong answers
                if (userAnswers[currentQuestionIndex] === index) {
                    optionElement.classList.add('selected');
                    if (index === currentQuestion.correctAnswer) {
                        optionElement.classList.add('correct');
                    } else {
                        optionElement.classList.add('wrong');
                    }
                } else if (index === currentQuestion.correctAnswer) {
                    // Show correct answer
                    optionElement.classList.add('correct');
                    optionElement.classList.add('disabled');
                }
            }
            
            optionElement.innerHTML = `
                <div class="option-label">${String.fromCharCode(1570 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            
            // Add click event if not already answered
            if (userAnswers[currentQuestionIndex] === null) {
                optionElement.addEventListener('click', () => selectAnswer(index));
            }
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Update navigation buttons
        updateNavigationButtons();
    }
    
    // Select an answer
    function selectAnswer(answerIndex) {
        // Mark answer as selected
        userAnswers[currentQuestionIndex] = answerIndex;
        
        // Check if answer is correct
        const currentQuestion = questions[currentLevel][currentQuestionIndex];
        if (answerIndex === currentQuestion.correctAnswer) {
            score++;
        }
        
        // Reload question to show feedback
        loadQuestion();
    }
    
    // Update navigation buttons state
    function updateNavigationButtons() {
        // Previous button
        prevQuestionBtn.disabled = currentQuestionIndex === 0;
        
        // Next button
        const isLastQuestion = currentQuestionIndex === questions[currentLevel].length - 1;
        nextQuestionBtn.disabled = isLastQuestion || userAnswers[currentQuestionIndex] === null;
        
        // Update button text for last question
        if (isLastQuestion) {
            nextQuestionBtn.textContent = 'آخر سؤال';
            nextQuestionBtn.disabled = userAnswers[currentQuestionIndex] === null;
        } else {
            nextQuestionBtn.innerHTML = 'التالي <i class="fas fa-arrow-left"></i>';
        }
    }
    
    // Show previous question
    function showPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
            updateProgress();
        }
    }
    
    // Show next question
    function showNextQuestion() {
        if (currentQuestionIndex < questions[currentLevel].length - 1) {
            currentQuestionIndex++;
            loadQuestion();
            updateProgress();
        }
    }
    
    // Update progress bar and counter
    function updateProgress() {
        const totalQuestions = questions[currentLevel].length;
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        
        questionCounter.textContent = `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}`;
        progressFill.style.width = `${progress}%`;
    }
    
    // Start the countdown timer
    function startTimer() {
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            
            // If time runs out, submit the quiz
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                submitQuiz();
            }
        }, 1000);
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (timeRemaining < 60) {
            timerElement.style.color = 'var(--danger-color)';
        } else if (timeRemaining < 180) {
            timerElement.style.color = 'var(--accent-color)';
        } else {
            timerElement.style.color = 'var(--primary-color)';
        }
    }
    
    // Submit the quiz and show results
    function submitQuiz() {
        // Clear timer
        clearInterval(timerInterval);
        
        // Calculate time taken
        const endTime = new Date();
        const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
        const minutesTaken = Math.floor(timeTakenInSeconds / 60);
        const secondsTaken = timeTakenInSeconds % 60;
        
        // Calculate score (in case some questions weren't answered)
        let finalScore = 0;
        questions[currentLevel].forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                finalScore++;
            }
        });
        
        // Calculate percentage
        const percentage = Math.round((finalScore / questions[currentLevel].length) * 100);
        
        // Switch to results screen
        quizScreen.classList.remove('active');
        resultsScreen.classList.add('active');
        
        // Update results display
        scoreValueElement.textContent = finalScore;
        percentageElement.textContent = `${percentage}%`;
        resultLevelElement.textContent = levelNames[currentLevel];
        timeTakenElement.textContent = `${minutesTaken.toString().padStart(2, '0')}:${secondsTaken.toString().padStart(2, '0')}`;
        
        // Update result message based on score
        let resultKey;
        if (percentage >= 90) {
            resultKey = 'excellent';
        } else if (percentage >= 75) {
            resultKey = 'veryGood';
        } else if (percentage >= 60) {
            resultKey = 'good';
        } else if (percentage >= 40) {
            resultKey = 'average';
        } else {
            resultKey = 'weak';
        }
        
        resultTitleElement.textContent = resultMessages[resultKey].title;
        resultDescriptionElement.textContent = resultMessages[resultKey].description;
        
        // Animate the score circle
        const circle = document.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // Trigger animation
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 100);
    }
    
    // Restart the quiz with same level
    function restartQuiz() {
        startQuiz();
    }
    
    // Go back to level selection
    function chooseLevel() {
        resultsScreen.classList.remove('active');
        welcomeScreen.classList.add('active');
    }
    
    // Initialize the application when DOM is loaded
    initApp();
});