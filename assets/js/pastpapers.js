const items = [
  {
    heading: "Accounting and Finance (AF)",
    para: "Accounting and finance involve recording and analyzing financial transactions to ensure accurate records, regulatory compliance, and informed business decisions, essential for growth and financial health.",
    link: "../html/Papers/AccountingAndFinance.html",
    rating: 5.0,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Advanced Computer Architecture (ACA)",
    para: "Advanced Computer Architecture (ACA) focuses on optimizing computer systems for enhanced performance through efficient hardware and software integration. It includes parallel processing and memory hierarchy concepts.",
    link: "../html/Papers/AdvancedComputerArchitecture.html",
    rating: 4.2,
    badge: "medium",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Advanced Database Concepts (ADC)",
    para: "Advanced Database Concepts cover topics like database optimization, distributed databases, data warehousing, and advanced querying techniques for efficient data management.",
    link: "../html/comingsoon.html",
    rating: 3.9,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Advanced Operating System (AOS)",
    para: "Advanced Operating Systems study complex topics like process synchronization, distributed systems, virtualization, and security to enhance OS efficiency and reliability.",
    link: "../html/comingsoon.html",
    rating: 4.5,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Advanced Programming (AP)",
    para: "Advanced Programming involves sophisticated coding techniques, algorithm optimization, and software design patterns, focusing on developing efficient, scalable, and maintainable code for complex applications and systems.",
    link: "../html/comingsoon.html",
    rating: 4.5,
    badge: "medium",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Advanced Software Engineering (ASE)",
    para: "Advanced Software Engineering covers methodologies for designing, developing, and maintaining complex software systems, emphasizing project management, quality assurance, agile practices, and advanced software architecture.",
    link: "../html/comingsoon.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Advanced Stats (AS)",
    para: "Advanced Statistics involves the study of complex data analysis techniques, including multivariate analysis, hypothesis testing, regression models, and statistical computing, to interpret and predict data trends accurately.",
    link: "../html/Papers/AdvancedStatistics.html",
    rating: 4.5,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Applied Physics (AP)",
    para: "Applied Physics applies fundamental physical principles to solve practical problems in engineering and technology, focusing on areas like materials science, optics, and electromagnetism for real-world applications.",
    link: "../html/Papers/AppliedPhysics.html",
    rating: 4.5,
    badge: "medium",
    ratingLink:
      "https://youtube.com/playlist?list=PLY8pCdWSlXrT0w1Yu3jU_lTUCkfFKVOm_&feature=shared",
  },
  {
    heading: "Artificial Intelligence (AI)",
    para: "Artificial Intelligence (AI) refers to systems or machines that simulate human intelligence to perform tasks, improve over time, and make decisions based on data analysis.",
    link: "../html/Papers/ArtificialIntelligence.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI&feature=shared",
  },
  {
    heading: "Big Data (BD)",
    para: "Big Data refers to large, complex datasets that traditional data processing tools can't handle. It involves capturing, storing, and analyzing massive amounts of information for insights.",
    link: "../html/Papers/BigData.html",
    rating: 4.5,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Brand Management (BM)",
    para: "Brand Management involves overseeing and influencing how a brand is perceived by consumers. It includes developing brand strategy, maintaining brand identity, and ensuring consistent messaging..",
    link: "../html/Papers/BrandManagement.html",
    rating: 4.5,
    badge: "medium",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Business Process Engineering (BPE)",
    para: "Business Process Engineering involves redesigning and optimizing business processes for efficiency and effectiveness. It focuses on improving workflows, reducing costs, and enhancing organizational performance.",
    link: "../html/Papers/BusinessProcessEngineering.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Calculus & Analytical Geometry  (Cal)",
    para: "Calculus is a branch of mathematics focused on limits, functions, derivatives, integrals, and infinite series. It studies change and motion, fundamental in science and engineering.",
    link: "../html/Papers/CalculusAndAnalyticalGeometry.html",
    rating: 4.5,
    badge: "easy",
    ratingLink:
      "https://youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv&feature=shared",
  },
  {
    heading: "Civics & Community Engagement (CCE)",
    para: "The Civics and Engagement course equips students with a deep understanding of civic responsibilities, governance, and the role of citizens in shaping society. Through this course, students will explore the importance of active participation in democratic processes, community involvement, and fostering social change.",
    link: "../html/Papers/CivicsandCommunity.html",
    rating: 4.2,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Cloud Computing (CC)",
    para: "Cloud Computing delivers computing services—servers, storage, databases, networking, software—over the internet. It offers scalable resources, on-demand access, and cost efficiency.",
    link: "../html/Papers/CloudComputing.html",
    rating: 4.5,
    badge: "medium",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "COAL",
    para: "Computer Organization and Assembly Language involve studying computer architecture, hardware components, and low-level programming. It focuses on how computers execute instructions and manage data at the machine level.",
    link: "../html/Papers/ComputerOrganizationandAssemblyLanguage.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLAZj-jE2acZLdYT7HLFgNph190z2cjmAG&feature=shared",
  },
  {
    heading: "COAL LAB",
    para: "Computer Organization and Assembly Language involve studying computer architecture, hardware components, and low-level programming. It focuses on how computers execute instructions and manage data at the machine level.",
    link: "../html/Papers/COAL-Lab.html",
    rating: 4.5,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Complier Construction",
    para: "Compiler Construction involves designing and implementing compilers, which translate high-level programming languages into machine code. It covers lexical analysis, syntax analysis, semantic analysis, optimization, and code generation.",
    link: "../html/Papers/CompilerConstruction.html",
    rating: 4.5,
    badge: "medium",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc&feature=shared",
  },
  {
    heading: "Computer Architecture (CA)",
    para: "Computer Architecture involves the design and organization of a computer's core components, including the CPU, memory, and input/output systems. It focuses on improving performance, efficiency, and scalability.",
    link: "../html/Papers/ComputerArchitecture.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX&feature=shared",
  },
  {
    heading: "Computer Modelling Simulation (CMS)",
    para: "Computer Modeling and Simulation involve creating digital representations of real-world systems to analyze their behavior. It is used for predicting outcomes, testing scenarios, and solving complex problems in various fields.",
    link: "../html/Papers/ComputerModellingSimulation.html",
    rating: 4.5,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Computer Networks (CN)",
    para: "Computer Networks connect multiple computing devices to share resources and information. They involve protocols, hardware, and software to enable communication, data exchange, and internet connectivity.",
    link: "../html/Papers/ComputerNetworks.html",
    rating: 4.5,
    badge: "medium",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&feature=shared",
  },
  {
    heading: "Computer Networks (LAB)",
    para: "Computer Networks connect multiple computing devices to share resources and information. They involve protocols, hardware, and software to enable communication, data exchange, and internet connectivity.",
    link: "../html/Papers/ComputerNetworksLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Computer Vision",
    para: "Computer Vision enables computers to interpret and understand visual information from the world. It involves image processing, object detection, and pattern recognition, used in applications like facial recognition and autonomous vehicles.",
    link: "../html/Papers/ComputerVision.html",
    rating: 4.5,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Communication and Presentation Skills (CPS)",
    para: "CPS focuses on effectively conveying ideas and information through speaking and writing. It involves clear articulation, engaging delivery, and persuasive techniques to impact and influence audiences.",
    link: "../html/Papers/CommunicationAndPresentationSkills.html",
    rating: 4.5,
    badge: "medium",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Communication and Presentation Skills (LAB)",
    para: "CPS focuses on effectively conveying ideas and information through speaking and writing. It involves clear articulation, engaging delivery, and persuasive techniques to impact and influence audiences.",
    link: "../html/Papers/CommunicationAndPresetationSkillsLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Critical Thinking (CT)",
    para: "Critical Thinking (CT) involves analyzing and evaluating information or arguments to make reasoned judgments. It emphasizes questioning assumptions, identifying biases, and drawing logical conclusions based on evidence.",
    link: "../html/Papers/CriticalThinking.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Data Science (DS)",
    para: "Data Science involves extracting insights and knowledge from data using statistical, computational, and analytical methods. It encompasses data collection, processing, visualization, and predictive modeling for decision-making.",
    link: "../html/Papers/DataScience.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Data Structures (DS)",
    para: "Data Structures are organized ways to store and manage data for efficient access and modification. Common types include arrays, linked lists, stacks, queues, and trees.",
    link: "../html/Papers/DataStructures.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLAXnLdrLnQpRcveZTtD644gM9uzYqJCwr&feature=shared",
  },
  {
    heading: "Data Structures LAB",
    para: "Data Structures are organized ways to store and manage data for efficient access and modification. Common types include arrays, linked lists, stacks, queues, and trees.",
    link: "../html/Papers/DataStructuresLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Data Warehousing and Data Mining",
    para: "Data Warehousing stores and manages large datasets for analysis, while Data Mining involves extracting patterns and insights from these datasets using statistical and computational techniques.",
    link: "../html/Papers/DataWarehousingAndDataMining.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "DataBase(DB)",
    para: "A Database is an organized collection of structured data stored electronically, allowing for efficient retrieval, management, and updating of information.",
    link: "../html/Papers/DatabaseSystems.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&feature=shared",
  },
  {
    heading: "DataBase Lab",
    para: "A Database is an organized collection of structured data stored electronically, allowing for efficient retrieval, management, and updating of information.",
    link: "/html/Papers/DatabaseSystemsLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Deep Learning (DL)",
    para: "Deep Learning is a subset of machine learning using neural networks with many layers. It excels in processing large datasets for tasks like image and speech recognition.",
    link: "../html/Papers/DeepLearning.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Design and Aanlysis of Algorithms",
    para: "Design and Analysis of Algorithms involves creating efficient algorithms and evaluating their performance and correctness, focusing on time and space complexity.",
    link: "../html/Papers/DesignAndAnalysisOfAlgorithms.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa&feature=shared",
  },
  {
    heading: "Differential Equations (Cal-II)",
    para: "Differential Equations (Cal-II) involve equations with functions and their derivatives, used to model dynamic systems and changes in various fields like physics, engineering, and biology.",
    link: "../html/Papers/DifferentialEquations.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Digital Image Processing (DIP)",
    para: "Digital Image Processing involves manipulating and analyzing digital images using algorithms to enhance, compress, and extract information for various applications.",
    link: "../html/Papers/DigitalImageProcessing.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Discrete Structures (DS)",
    para: "Discrete Structures study mathematical structures that are countable or distinct, such as graphs, sets, and logic, essential for computer science and algorithm design.",
    link: "../html/Papers/DiscreteStructures.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLtCBuHKmdxOduWhQPbEwLN2ULKMqgQ44m&feature=shared",
  },
  {
    heading: "Digital logic design (DLD)",
    para: "Digital Logic Design involves creating and analyzing digital circuits using logic gates, flip-flops, and other components to perform specific functions and computations in electronic systems.",
    link: "../html/Papers/DigitalLogicDesign.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&feature=shared",
  },
  {
    heading: "Digital logic design (LAB)",
    para: "Digital Logic Design involves creating and analyzing digital circuits using logic gates, flip-flops, and other components to perform specific functions and computations in electronic systems.",
    link: "../html/Papers/DigitalLogicDesignLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "E-Commerce",
    para: "Ecommerce refers to buying and selling goods or services online. It involves various activities like online transactions, digital marketing, and customer service, facilitated through web platforms.",
    link: "../html/Papers/E-commerce.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Enterprise Information Systems (EIS)",
    para: "Enterprise Information Systems are integrated software platforms that manage and streamline business processes across an organization, including functions like finance, HR, and supply chain management.",
    link: "../html/Papers/EnterpriseInformationSystems.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "English Comprehension and Composition ",
    para: "English Comprehension and Composition focus on understanding and analyzing written texts, as well as writing clearly and effectively. It includes skills in reading comprehension, critical thinking, and structured writing.",
    link: "../html/Papers/EnglishCompositionAndComprehension.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "English Comprehension and Composition LAB ",
    para: "English Comprehension and Composition focus on understanding and analyzing written texts, as well as writing clearly and effectively. It includes skills in reading comprehension, critical thinking, and structured writing.",
    link: "../html/Papers/EnglishComprehensionLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Entrepreneurship ",
    para: "Entrepreneurship involves starting and managing new business ventures. It includes identifying opportunities, creating business plans, securing funding, and driving innovation to achieve success and growth.",
    link: "../html/Papers/entrepreneurship.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Environmental Sciences (ES)",
    para: "Environmental Sciences study the interactions between natural systems and human activities, focusing on issues like pollution, conservation, and sustainability to address environmental challenges.",
    link: "../html/Papers/EnvironmetalScience.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Evolutionary Computation (EC)",
    para: "Evolutionary Computation is a subset of artificial intelligence that uses algorithms inspired by natural evolution, such as genetic algorithms, to solve optimization problems and model complex systems.",
    link: "../html/Papers/EvolutionaryComputing.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Expository Writing (EW)",
    para: "Expository Writing aims to explain or inform by presenting facts, ideas, or instructions clearly and logically. It focuses on providing a thorough understanding of a topic through detailed and objective writing.",
    link: "../html/Papers/ExpositoryWriting.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Expository Writing LAB",
    para: "Expository Writing aims to explain or inform by presenting facts, ideas, or instructions clearly and logically. It focuses on providing a thorough understanding of a topic through detailed and objective writing.",
    link: "../html/Papers/ExpositoryWritingLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Formal Methods (FM)",
    para: "Formal Methods involve using mathematical techniques to specify, develop, and verify software and systems, ensuring correctness, reliability, and security through rigorous proofs and models.",
    link: "../html/Papers/FormalMethods.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Functional English (FE)",
    para: "Functional English focuses on practical language skills needed for everyday communication, such as reading, writing, speaking, and listening. It emphasizes using English effectively in real-world contexts, like work, education, and social interactions.",
    link: "../html/Papers/FunctionalEnglish.html",
    rating: 4,
    badge: "easy",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Generative AI",
    para: "Generative AI refers to artificial intelligence systems that create new content, such as images, text, or music, by learning patterns from existing data. Examples include generative adversarial networks (GANs) and large language models.",
    link: "../html/Papers/GenerativeAI.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Human Computer Interaction (HCI)",
    para: "Human-Computer Interaction (HCI) studies the design and use of computer systems by focusing on the interaction between users and technology, aiming to improve usability, user experience, and accessibility.",
    link: "../html/Papers/HumanComputerInteraction.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Human Resource Management (HRM)",
    para: "Human Resource Management (HRM) involves managing and developing an organization’s workforce. It includes recruitment, training, performance management, compensation, and ensuring compliance with labor laws and regulations.",
    link: "../html/Papers/HumanResourceManagement.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PL9Cd7H8NFRQyHThG3ol8UEt4UD8Gyclo-&feature=shared",
  },
  {
    heading: "Introduction to Information and Communication Technology (IICT)",
    para: "Introduction to Information and Communication Technology (ICT) covers the basics of how information technology and communication systems work together. It includes topics like computer hardware, software, networking, data management, and the impact of ICT on society and business.",
    link: "../html/Papers/IntroductionToICT.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "International Relations (IR)",
    para: "International Relations studies the interactions between countries, including diplomacy, conflict, trade, and international organizations. It explores how global issues and policies affect relations among states and other actors.",
    link: "../html/Papers/InternationalRelations.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Introduction to Data Science (IDS)",
    para: "Introduction to Data Science covers the basics of data analysis, including data collection, cleaning, exploration, and visualization. It introduces key concepts like statistical methods, machine learning, and tools used for analyzing data to gain insights and make data-driven decisions.",
    link: "../html/Papers/IntroductionToDataScience.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLMrJAkhIeNNQV7wi9r7Kut8liLFMWQOXn&feature=shared",
  },
  {
    heading: "Intro to Internet of Things (IOT)",
    para: "Introduction to the Internet of Things (IoT) explores the concept of interconnected devices that communicate and share data over the internet. It covers IoT architecture, sensors, data collection, and applications across various domains such as smart homes, healthcare, and industrial automation.",
    link: "../html/Papers/IntroductionToInternetOfThings.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Introduction to Software Engineering(ISE)",
    para: "Introduction to Software Engineering (ISE) covers the fundamentals of developing software systems. It includes software development methodologies, project management, requirements analysis, design, coding, testing, and maintenance. The course aims to provide a comprehensive understanding of the software development lifecycle and best practices.",
    link: "../html/Papers/IntroductiontoSE.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Islamic Studies",
    para: "Islamic Studies explores the religious, cultural, and historical aspects of Islam. It includes the study of Islamic theology, history, law, practices, and contributions to science and culture, as well as the interpretation of religious texts and traditions.",
    link: "../html/Papers/IslamicStudies.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Linear Algebra(LA)",
    para: "Linear Algebra focuses on vector spaces, linear transformations, and matrices. It involves studying systems of linear equations, eigenvalues, eigenvectors, and applications in various fields such as engineering, computer science, and physics.",
    link: "../html/Papers/LinearAlgebra.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLFD0EB975BA0CC1E0&feature=shared",
  },
  {
    heading: "Management and Organizational Behavior",
    para: "Management and Organizational Behavior examines how individuals and groups interact within organizations. It includes studying leadership, motivation, team dynamics, decision-making, and organizational culture to improve effectiveness and performance in the workplace.",
    link: "../html/Papers/ManagementAndOrganizationalBehavior.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLmAmHQ-_5ySyL_zgag85MMunZTomBdj6y&feature=shared",
  },
  {
    heading: "Marketing Management",
    para: "Marketing Management involves planning and executing strategies to promote and sell products or services. It includes market research, product development, pricing strategies, distribution, and promotional tactics to meet customer needs and achieve business goals.",
    link: "../html/Papers/MarketingManagement.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLaAhQ2ofZZRBhZEC2Oqm-vg2iMeOo1V7J&feature=shared",
  },
  {
    heading: "Mass Communication",
    para: "Mass Communication studies the processes and effects of transmitting information to large audiences through various media channels, such as television, radio, newspapers, and digital platforms. It covers media theory, content creation, audience analysis, and the impact of media on society.",
    link: "../html/Papers/MassCommunication.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Modern Politics and Government",
    para: "Modern Politics and Government examines contemporary political systems, structures, and processes. It includes the study of political ideologies, institutions, policy-making, governance models, and the role of political parties and public opinion in shaping government actions.",
    link: "../html/Papers/ModernPoliticsAndGovernment.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Multivariable Calculus (Cal-III)",
    para: "MVC (Multivariable Calculus) involves extending calculus concepts to functions of multiple variables. It includes topics like partial derivatives, multiple integrals, vector calculus, and applications in fields such as physics and engineering.",
    link: "../html/Papers/MultivariableCalculus.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLSQl0a2vh4HC5feHa6Rc5c0wbRTx56nF7&feature=shared",
  },
  {
    heading: "Natural Language Processing (NLP)",
    para: "Natural Language Processing (NLP) is a branch of artificial intelligence focused on enabling computers to understand, interpret, and generate human language. It includes tasks like text analysis, language translation, sentiment analysis, and speech recognition.",
    link: "../html/Papers/NaturalLanguageProcessing.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Network Security (NS)",
    para: "It involves protecting computer networks from various threats such as unauthorized access, cyberattacks, and data breaches. It includes practices like encryption, firewalls, and intrusion detection systems to ensure the confidentiality, integrity, and availability of networked data and systems.",
    link: "../html/Papers/NetworkSecurity.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Numerical Computing",
    para: "Numerical Computing involves using algorithms and computational techniques to solve mathematical problems that are difficult to solve analytically. It focuses on approximating solutions for equations, optimization, and simulations in fields like engineering, physics, and finance.",
    link: "../html/Papers/NumericalComputing.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Object-Oriented Programming (OOP)",
    para: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects, which encapsulate data and methods. It emphasizes principles like inheritance, encapsulation, polymorphism, and abstraction to improve code reusability, scalability, and maintenance.",
    link: "../html/Papers/ObjectOrientedProgramming.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      " https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&feature=shared",
  },
  {
    heading: "Object-Oriented Programming Lab",
    para: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects, which encapsulate data and methods. It emphasizes principles like inheritance, encapsulation, polymorphism, and abstraction to improve code reusability, scalability, and maintenance.",
    link: "../html/Papers/ObjectOrientedProgrammingLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Operations Research (OR)",
    para: "Operations Research involves using mathematical models, statistical analysis, and optimization techniques to make better decisions and solve complex problems in areas like logistics, resource management, and strategic planning.",
    link: "../html/Papers/OperationsResearch.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Operating Systems (OS)",
    para: "Operating Systems (OS) manage computer hardware and software resources, providing a platform for applications to run. Key functions include managing memory, processes, file systems, and user interfaces, and ensuring system stability and security.",
    link: "../html/Papers/OperatingSystems.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Operating Systems LAB (OS)",
    para: "Operating Systems (OS) manage computer hardware and software resources, providing a platform for applications to run. Key functions include managing memory, processes, file systems, and user interfaces, and ensuring system stability and security.",
    link: "../html/Papers/OperatingSystemsLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Pakistan Studies",
    para: "Pakistan Studies explores the history, culture, geography, politics, and economy of Pakistan. It includes the study of the country's independence movement, foundational principles, and contemporary issues affecting its development and identity.",
    link: "../html/Papers/PakistanStudies.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Parallel and Distributed Computing",
    para: "Parallel and Distributed Computing involves designing and implementing systems that perform computations simultaneously or across multiple computers. Parallel computing uses multiple processors to execute tasks concurrently, while distributed computing spreads tasks across a network of interconnected computers to solve large-scale problems efficiently.",
    link: "../html/Papers/ParallelAndDistributedComputing.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PL0s3O6GgLL5fbwQ8HBuK0Bh--GZzM8j1M&feature=shared",
  },
  {
    heading: "Programming Fundamentals (PF)",
    para: "Programming Fundamentals cover the basic concepts and techniques of computer programming. This includes understanding data types, variables, control structures (like loops and conditionals), functions, and basic algorithms. It provides a foundation for writing and debugging code in various programming languages.",
    link: "../html/Papers/ProgrammingFundamentals.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&feature=shared",
  },
  {
    heading: "Programming Fundamentals LAB",
    para: "Programming Fundamentals cover the basic concepts and techniques of computer programming. This includes understanding data types, variables, control structures (like loops and conditionals), functions, and basic algorithms. It provides a foundation for writing and debugging code in various programming languages.",
    link: "../html/Papers/ProgrammingFundamentalsLab.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Principles of Leadership",
    para: "Principles of Leadership focus on key concepts and practices for effective leadership. This includes understanding leadership styles, communication skills, motivation techniques, decision-making, and team management. The goal is to inspire and guide individuals or teams to achieve organizational objectives.",
    link: "../html/Papers/PrinciplesOfLeadership.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Probability",
    para: "Probability is the branch of mathematics that deals with the likelihood of events occurring. It involves calculating the chance or probability of various outcomes based on known or assumed conditions, using concepts such as probability distributions, random variables, and statistical inference.",
    link: "../html/Papers/ProbabilityAndStatistics.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLU6SqdYcYsfLRq3tu-g_hvkHDcorrtcBK&feature=shared",
  },
  {
    heading: "Psychology",
    para: "Psychology is the scientific study of behavior and mental processes. It encompasses various areas, including cognitive, developmental, social, and clinical psychology, focusing on understanding how individuals think, feel, and act, and applying this knowledge to improve mental health and well-being.",
    link: "../html/Papers/Psychology.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLyUsz36A6UmUZ5AyBMa8yh_OZvbIaRiu6&feature=shared",
  },
  {
    heading: "Quantum Computing",
    para: "Quantum Computing explores computing using quantum-mechanical phenomena like superposition and entanglement. It aims to solve complex problems faster than classical computers by leveraging quantum bits (qubits) to perform multiple calculations simultaneously.",
    link: "../html/Papers/QuantumComputing.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Software Construction & Development (SCD)",
    para: "Software Construction & Development involves creating, building, and refining software applications. It includes coding, debugging, testing, and deploying software, as well as managing software development processes, methodologies, and tools to ensure the creation of reliable and efficient software systems.",
    link: "../html/Papers/SoftwareConstructionAndDevelopment.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLmeQIS8S5cYMNI2W3t-h_tJ3uTJjeafzy&feature=shared",
  },
  {
    heading: "Software Engineering Technologies",
    para: "Software Engineering Technologies (SE Technologies) encompass the tools, methodologies, and practices used to develop and manage software systems. This includes various development methodologies (like Agile and Scrum), tools for version control, integrated development environments (IDEs), testing frameworks, and techniques for ensuring software quality and scalability.",
    link: "../html/Papers/SoftwareEngineeringTechnologies.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Software For Mobile Devices (SMD)",
    para: "Software for Mobile Devices involves developing applications and systems designed to run on mobile platforms such as smartphones and tablets. This includes mobile app development for iOS and Android, using programming languages like Swift, Kotlin, or Java, and frameworks like React Native or Flutter. It focuses on optimizing performance, user experience, and integrating with mobile-specific features like GPS and sensors.",
    link: "../html/Papers/SoftwareForMobileDevices.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Social Networking Analysis",
    para: "Social Network Analysis examines the relationships and interactions within social networks. It involves mapping and analyzing the connections between individuals or groups to understand patterns, influence, and the structure of social dynamics. This analysis can reveal insights into communication flows, community structures, and key influencers.",
    link: "../html/Papers/SocialNetworkingAnalysis.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Sociology",
    para: "Sociology is the study of society and human behavior, examining how social structures, institutions, and interactions influence individuals and groups. It covers topics like culture, socialization, stratification, and social change, aiming to understand and address social issues and dynamics.",
    link: "../html/Papers/Sociology.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Software Design and Analysis",
    para: "Software Design and Analysis involves creating and evaluating software architectures and systems. It includes defining requirements, designing system components, creating models (like UML diagrams), and analyzing the system for efficiency, scalability, and maintainability. The goal is to ensure that the software meets user needs and is robust and adaptable.",
    link: "../html/Papers/SoftwareDesignAndAnalysis.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Software Engineering",
    para: "Software Engineering is the systematic approach to developing, operating, and maintaining software. It encompasses the entire software development lifecycle, including requirements analysis, design, implementation, testing, deployment, and maintenance. Key principles include following methodologies (like Agile or Waterfall), managing software projects, ensuring quality, and using best practices to produce reliable and efficient software systems.",
    link: "../html/Papers/SoftwareEngineering.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&feature=shared",
  },

  {
    heading: "Software Process Management and Metrics",
    para: "Software Process Management and Metrics involve overseeing and optimizing the software development process using quantitative measures. It includes managing development workflows, assessing productivity and quality through metrics (like defect density, cycle time, and code coverage), and implementing process improvements to enhance efficiency and effectiveness in software projects.",
    link: "../html/Papers/SoftwareProcessManagementAndMetrics.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },

  {
    heading: "Software Requirements Engineering",
    para: "Software Requirements Engineering involves gathering, analyzing, documenting, and managing software requirements. It focuses on understanding what users need from a system, defining clear and detailed requirements, and ensuring that these requirements guide the design and development process effectively. This includes techniques like interviews, surveys, and use case analysis to capture and validate user needs.",
    link: "../html/Papers/SoftwareRequirementsEngineering.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },

  {
    heading: "Software Testing",
    para: "Software Testing involves evaluating a software application to identify defects and ensure it meets specified requirements. It includes various techniques such as unit testing, integration testing, system testing, and acceptance testing. The goal is to verify that the software functions correctly, is free of bugs, and meets quality standards before deployment.",
    link: "../html/Papers/SoftwareTesting.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },

  {
    heading: "Fundamentals of Software Project Management",
    para: "Fundamentals of Software Project Management involve planning, executing, and overseeing software development projects to ensure they meet goals, deadlines, and budgets. Key aspects include defining project scope, scheduling tasks, allocating resources, managing risks, and ensuring quality. Effective project management ensures that software projects are completed successfully and efficiently.",
    link: "../html/Papers/FundamentalsOfSoftwareProjectManagement.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PL7FvtDeeLOS8uJQb3sF6x3VOyHY_WJj_5&feature=shared",
  },

  {
    heading: "Software Quality <br>Assurance (SQA)",
    para: "Software Quality Assurance (SQA) involves ensuring that software meets quality standards throughout its development lifecycle. It includes activities like defining quality criteria, conducting reviews and audits, performing testing, and implementing processes to prevent defects. SQA aims to deliver reliable, functional, and user-friendly software.",
    link: "../html/Papers/SoftwareQualityAssuranceAndManagement.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },

  {
    heading: "Software Quality Engineering (SQE)",
    para: "Software Quality Engineering (SQE) focuses on the technical aspects of ensuring software quality. It involves applying engineering principles to design, develop, and implement testing processes, tools, and methodologies to identify and resolve defects, enhance performance, and ensure that software meets specified requirements and standards.",
    link: "../html/Papers/SoftwareQualityEngineering.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLKyB9RYzaFRhUPKcG5iGIChnifC12ylP5&feature=shared",
  },
  {
    heading: "Statistical Pattern Recognition and Learning",
    para: "Statistical Pattern Recognition and Learning involve using statistical methods and algorithms to identify patterns and make predictions based on data. It includes techniques like classification, clustering, and regression to analyze and interpret complex datasets, enabling systems to learn from data and improve decision-making over time.",
    link: "../html/Papers/StatisticalPatternRecognitionAndLearning.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Technical & Business Writing",
    para: "Technical and Business Writing involves creating clear, concise, and effective documents for various professional purposes. Technical writing focuses on explaining complex information, such as user manuals and technical reports, while business writing includes crafting documents like reports, proposals, and emails to communicate effectively within and outside an organization. Both aim to convey information accurately and persuasively.",
    link: "../html/Papers/TechnicalAndBusinessWriting.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Theory of Automata (TOA)",
    para: "The Theory of Automata studies abstract machines and their computational capabilities, exploring concepts like state machines, languages, and algorithms for automata processing and recognition.",
    link: "../html/Papers/TheoryofAutomata.html",
    rating: 4.5,
    badge: "hard",
    ratingLink:
      "https://youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T&feature=shared",
  },
  {
    heading: "Theory of Programming Languages",
    para: "The Theory of Programming Languages examines the design, implementation, analysis, and classification of programming languages. It explores syntax, semantics, and the theory behind language constructs and their execution",
    link: "../html/Papers/TheoryOfProgrammingLanguages.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Web Engineering",
    para: "Web engineering is the process of designing, building, and maintaining web applications and systems. It encompasses various skills and technologies, including programming languages, databases, user experience design, and security",
    link: "../html/Papers/WebEngineering.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
  {
    heading: "Web Programming",
    para: "Web programming involves creating web pages, web applications, and other online content that can be displayed in a web browser. Web programming is accomplished using a variety of programming languages, including HTML, CSS, JavaScript, PHP, Python, Ruby, and Java.",
    link: "../html/Papers/WebProgramming.html",
    rating: 4.5,
    badge: "hard",
    ratingLink: "../html/playlist.html",
  },
];

let currentIndex = 0;

function createDivs(count) {
  const container = document.getElementById("container");
  for (let i = 0; i < count; i++) {
    if (currentIndex >= items.length) {
      document.getElementById("viewMoreBtn").disabled = true;
      return;
    }

    const div = document.createElement("div");
    div.className = "item";

    const link = document.createElement("a");
    link.href = items[currentIndex].link;

    const heading = document.createElement("h2");
    heading.textContent = items[currentIndex].heading;
    link.appendChild(heading);



    const para = document.createElement("p");
    para.textContent = items[currentIndex].para;
    link.appendChild(para);

    div.appendChild(link);

    const badge = document.createElement("div");
    badge.className = `badge ${items[currentIndex].badge}`;
    badge.textContent =
      items[currentIndex].badge.charAt(0).toUpperCase() +
      items[currentIndex].badge.slice(1);
    div.appendChild(badge);

    const papersIconContainer = document.createElement("div");
    papersIconContainer.className = "papers-icon-container";

    const linkbtn = document.createElement("a");
    linkbtn.className = "link-button";
    linkbtn.href = items[currentIndex].link;

    const papersIcon = document.createElement("i");
    papersIcon.className = "fas fa-file-alt";

    const hoverText = document.createElement("span");
    hoverText.className = "hover-text";
    hoverText.textContent = "Access Papers";
    linkbtn.appendChild(papersIcon);
    linkbtn.appendChild(hoverText);
    papersIconContainer.appendChild(linkbtn);
    div.appendChild(papersIconContainer);

    if (items[currentIndex].rating !== undefined) {
      const ratingDiv = document.createElement("div");
      ratingDiv.className = "rating";

      const ratingButton = document.createElement("a");
      ratingButton.className = "rating-button";
      ratingButton.href = items[currentIndex].ratingLink;

      const image = document.createElement("img");
      image.className = "rating-image";
      image.src = "../assets/images/playbutton.webp"; // Replace with your image path
      image.alt = "YouTube Play Button"; // Alt text for accessibility

      const text = document.createElement("span");
      text.className = "rating-text";
      text.textContent = "Playlist";

      ratingButton.appendChild(image);
      ratingButton.appendChild(text);

      ratingDiv.appendChild(ratingButton);
      div.appendChild(ratingDiv);
    }

    container.appendChild(div);
    currentIndex++;
  }
}



function loadMoreDivs() {
  createDivs(12);
}

// Load initial 12 divs
createDivs(12);
function filterItems(searchText) {
  const container = document.getElementById('container');
  container.innerHTML = ''; // Clear existing content

  let itemsFound = false; // Flag to check if any item matches the search

  items.forEach((item) => {
    const headingText = item.heading.toLowerCase();
    const searchLower = searchText.toLowerCase();

    // Only check if the search text is in the heading text
    if (headingText.includes(searchLower)) {
      itemsFound = true; // Set flag to true if a matching item is found
      const div = document.createElement('div');
      div.className = 'item';

      const link = document.createElement("a");
      link.href = item.link;

      const heading = document.createElement("h2");
      heading.textContent = item.heading;
      link.appendChild(heading);

      // Create the paragraph element but do not use it for filtering
      const para = document.createElement("p");
      para.textContent = item.para;
      link.appendChild(para);

      div.appendChild(link);

      const badge = document.createElement("div");
      badge.className = `badge ${item.badge}`;
      badge.textContent =
        item.badge.charAt(0).toUpperCase() + item.badge.slice(1);
      div.appendChild(badge);

      const papersIconContainer = document.createElement("div");
      papersIconContainer.className = "papers-icon-container";

      const linkbtn = document.createElement("a");
      linkbtn.className = "link-button";
      linkbtn.href = item.link;

      const papersIcon = document.createElement("i");
      papersIcon.className = "fas fa-file-alt";

      const hoverText = document.createElement("span");
      hoverText.className = "hover-text";
      hoverText.textContent = "Access Papers";
      linkbtn.appendChild(papersIcon);
      linkbtn.appendChild(hoverText);
      papersIconContainer.appendChild(linkbtn);
      div.appendChild(papersIconContainer);

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "rating";

      const ratingButton = document.createElement("a");
      ratingButton.className = "rating-button";
      ratingButton.href = item.ratingLink;

      const image = document.createElement("img");
      image.className = "rating-image";
      image.src = "../assets/images/playbutton.webp"; // Replace with your image path
      image.alt = "YouTube Play Button"; // Alt text for accessibility

      const text = document.createElement("span");
      text.className = "rating-text";
      text.textContent = "Playlist";

      ratingButton.appendChild(image);
      ratingButton.appendChild(text);

      ratingDiv.appendChild(ratingButton);
      div.appendChild(ratingDiv);

      container.appendChild(div);
    }
  });

  if (!itemsFound) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'No courses found matching your search criteria.';
    container.appendChild(errorDiv);
  }
}



// Add event listener for search bar input
document
  .querySelector(".search-bar input")
  .addEventListener("input", function () {
    const searchText = this.value;
    filterItems(searchText);
  });

document.addEventListener("DOMContentLoaded", function () {
  var myBtn = document.getElementById("myBtn");
  var progressCircle = document.querySelector(".progress-ring__circle");
  var radius = progressCircle.r.baseVal.value;
  var circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function updateProgress() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    setProgress(scrollPercent);
  }

  window.onscroll = function () {
    if (
      document.body.scrollTop > 10 ||
      document.documentElement.scrollTop > 10
    ) {
      myBtn.style.display = "block";
    } else {
      myBtn.style.display = "none";
    }
    updateProgress();
  };

  myBtn.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  updateProgress();
});
let slideIndex = 1;
const totalSlides = document.getElementsByClassName("testimonial-slide").length;
showSlides(slideIndex);
autoSlide();

function changeSlide(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  let slides = document.getElementsByClassName("testimonial-slide");
  let indicators = document.getElementsByClassName("slide-indicator");

  if (n > totalSlides) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = totalSlides;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active", "prev-slide", "next-slide");
    slides[i].style.opacity = "0";
  }

  for (let i = 0; i < indicators.length; i++) {
    indicators[i].classList.remove("active");
  }

  let offset =
    -(slideIndex - 1) * (slides[0].offsetWidth + 20) +
    (document.querySelector(".slideshow-container").offsetWidth / 2 -
      slides[0].offsetWidth / 2);

  document.querySelector(
    ".slides-wrapper"
  ).style.transform = `translateX(${offset}px)`;

  slides[slideIndex - 1].style.opacity = "1";
  slides[slideIndex - 1].classList.add("active");
  indicators[slideIndex - 1].classList.add("active");

  let prevIndex = (slideIndex - 2 + totalSlides) % totalSlides;
  let nextIndex = slideIndex % totalSlides;

  slides[prevIndex].style.opacity = "0.5";
  slides[prevIndex].classList.add("prev-slide");

  slides[nextIndex].style.opacity = "0.5";
  slides[nextIndex].classList.add("next-slide");
}

function autoSlide() {
  slideIndex++;
  showSlides(slideIndex);
  setTimeout(autoSlide, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  let prevButton = document.querySelector(".prev-button");
  let nextButton = document.querySelector(".next-button");

  prevButton.addEventListener("click", () => changeSlide(-1));
  nextButton.addEventListener("click", () => changeSlide(1));

  let indicators = document.getElementsByClassName("slide-indicator");
  for (let i = 0; i < indicators.length; i++) {
    (function (index) {
      indicators[index].addEventListener("click", function () {
        showSlides(index + 1);
      });
    })(i);
  }
});