import React, { useState } from "react";
import "./PlaylistsPage.css";
import Navbar from "../Index/components/Navbar.js";
import { FaSearch } from "react-icons/fa";
import Footer from "../Footer/Footer.js";
import BackToTopButton from "../Index/components/BackToTop";

const PlaylistsPage = () => {
    const playlists = [
        {
            shortForm: 'PF',
            name: 'Programming Fundamentals (PF)',
            playlistLink: 'https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&feature=shared',
            videoCount: 226,
            VideoId: 'z9bZufPHFLU',
        },
        {
            shortForm: 'AP',
            name: 'Applied Physics (AP)',
            playlistLink: 'https://youtube.com/playlist?list=PLY8pCdWSlXrT0w1Yu3jU_lTUCkfFKVOm_&feature=shared',
            videoCount: 86,
            VideoId: 'AquETg8G0es',
        },
        {
            shortForm: 'CAL',
            name: 'Calculus and Analytical Geometry (CAL)',
            playlistLink: 'https://youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv&feature=shared',
            videoCount: 332,
            VideoId: 'GiCojsAWRj0',
        },
        {
            shortForm: 'OOP',
            name: 'Object Oriented Programming (OOP)',
            playlistLink: 'https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&feature=shared',
            videoCount: 37,
            VideoId: 'nGJTWaaFdjc',
        },
        {
            shortForm: 'DLD',
            name: 'Digital Logic Design (DLD)',
            playlistLink: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&feature=shared',
            videoCount: 202,
            VideoId: 'M0mx8S05v60',
        },
        {
            shortForm: 'MVC',
            name: 'Multivariable Calculus (MVC)',
            playlistLink: 'https://youtube.com/playlist?list=PLSQl0a2vh4HC5feHa6Rc5c0wbRTx56nF7&feature=shared',
            videoCount: 175,
            VideoId: 'TrcCbdWwCBc',
        },
        {
            shortForm: 'DS',
            name: 'Data Structures (DS)',
            playlistLink: 'https://youtube.com/playlist?list=PLAXnLdrLnQpRcveZTtD644gM9uzYqJCwr&feature=shared',
            videoCount: 163,
            VideoId: '0IAPZzGSbME',
        },
        {
            shortForm: 'COAL',
            name: 'Computer Organization and Assembly Language (COAL)',
            playlistLink: 'https://youtube.com/playlist?list=PLAZj-jE2acZLdYT7HLFgNph190z2cjmAG&feature=shared',
            videoCount: 18,
            VideoId: '_BpOV3G1-m0',
        },
        {
            shortForm: 'PDC',
            name: 'Parallel and Distributed Computing (PDC)',
            playlistLink: 'https://youtube.com/playlist?list=PL0s3O6GgLL5fbwQ8HBuK0Bh--GZzM8j1M&feature=shared',
            videoCount: 12,
            VideoId: 'tWRL2VJL-FA',
        },
        {
            shortForm: 'TA',
            name: 'Theory of Automata (TA)',
            playlistLink: 'https://youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T&feature=shared',
            videoCount: 112,
            VideoId: '9kuynHcM3UA',
        },
        {
            shortForm: 'SE',
            name: 'Software Engineering (SE)',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&feature=shared',
            videoCount: 58,
            VideoId: 'uJpQlyT_CK4',
        },
        {
            shortForm: 'CA',
            name: 'Computer Architecture (CA)',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX&feature=shared',
            videoCount: 66,
            VideoId: 'L9X7XXfHYdU',
        },
        {
            shortForm: 'AHCI',
            name: 'Applied Human Computer Interaction (AHCI)',
            playlistLink: 'https://youtube.com/playlist?list=PLYwpaL_SFmcDz_8-pygbcNvNF0DEwKoIL&feature=shared',
            videoCount: 29,
            VideoId: 'Pf_zJ2oRMEU',
        },
        {
            shortForm: 'CC',
            name: 'Compiler Construction (CC)',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc&feature=shared',
            videoCount: 39,
            VideoId: 'XUsw5igq4DM',
        },
        {
            shortForm: 'ADMS',
            name: 'Advanced Database Management System (ADMS)',
            playlistLink: 'https://youtube.com/playlist?list=PLm9FYbXgpdMqq310GHRv30ltrjWFcB5RU&feature=shared',
            videoCount: 80,
            VideoId: 'iUApyIf2h-A',
        },
        {
            shortForm: 'SRE',
            name: 'Software Requirements Engineering (SRE)',
            playlistLink: 'https://youtube.com/playlist?list=PLptLP7KjDoqVcNGqntp2FhuWHGNe6evcb&feature=shared',
            videoCount: 30,
            VideoId: 'YV0GfAoEhnM',
        },
        {
            shortForm: 'SDA',
            name: 'Software Design and Architecture (SDA)',
            playlistLink: 'https://youtube.com/playlist?list=PLfX2IHFUV0cEenh8hld1s3MmtGdCNYBCg&feature=shared',
            videoCount: 30,
            VideoId: 'xtZwezSAzTA',
        },
        {
            shortForm: 'SCD',
            name: 'Software Construction & Development (SCD)',
            playlistLink: 'https://youtube.com/playlist?list=PLmeQIS8S5cYMNI2W3t-h_tJ3uTJjeafzy&feature=shared',
            videoCount: 11,
            VideoId: '9LDm4Ss181E',
        },
        {
            shortForm: 'SQE',
            name: 'Software Quality Engineering (SQE)',
            playlistLink: 'https://youtube.com/playlist?list=PLKyB9RYzaFRhUPKcG5iGIChnifC12ylP5&feature=shared',
            videoCount: 230,
            VideoId: 'I2d86QjR8YM',
        },
        {
            shortForm: 'FSPM',
            name: 'Fundamentals of Software Project Management (FSPM)',
            playlistLink: 'https://youtube.com/playlist?list=PL7FvtDeeLOS8uJQb3sF6x3VOyHY_WJj_5&feature=shared',
            videoCount: 35,
            VideoId: 'QET1yfK49ZE',
        },
        {
            shortForm: 'IDS',
            name: 'Introduction to Data Science (IDS)',
            playlistLink: 'https://youtube.com/playlist?list=PLMrJAkhIeNNQV7wi9r7Kut8liLFMWQOXn&feature=shared',
            videoCount: 20,
            VideoId: 'pzo13OPXZS4',
        },
        {
            shortForm: 'FSE',
            name: 'Fundamentals of Software Engineering (FSE)',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&feature=shared',
            videoCount: 58,
            VideoId: 'uJpQlyT_CK4',
        },
        {
            shortForm: 'FA',
            name: 'Fundamentals of Accounting (FA)',
            playlistLink: 'https://youtube.com/playlist?list=PLiaygP8qeQGXgy77KXabPdkO5ZFbskgtm&feature=shared',
            videoCount: 20,
            VideoId: 'dCi-mNlf96Y',
        },
        {
            shortForm: 'FM',
            name: 'Fundamentals of Management (FM)',
            playlistLink: 'https://youtube.com/playlist?list=PLJtJvO3aaWe16eg-L7sJ1Ww3021CWlJU9&feature=shared',
            videoCount: 14,
            VideoId: 'I6-QB-EIdsE',
        },
        {
            shortForm: 'PSY',
            name: 'Psychology/Sociology',
            playlistLink: 'https://youtube.com/playlist?list=PLyUsz36A6UmUZ5AyBMa8yh_OZvbIaRiu6&feature=shared',
            videoCount: 34,
            VideoId: 'DbTt_ySTjaY',
        },
        {
            shortForm: 'DAB',
            name: 'Data Analysis for Business I',
            playlistLink: 'https://youtube.com/playlist?list=PLim9gWjsjN-NjHF51E0mz9CnledJ3cN4r&feature=shared',
            videoCount: 30,
            VideoId: 'ffwEAprsel8',
        },
        {
            shortForm: 'MM',
            name: 'Marketing Management',
            playlistLink: 'https://youtube.com/playlist?list=PLaAhQ2ofZZRBhZEC2Oqm-vg2iMeOo1V7J&feature=shared',
            videoCount: 23,
            VideoId: 'UMfWG1meBBc',
        },
        {
            shortForm: 'ME',
            name: 'Microeconomics',
            playlistLink: 'https://youtube.com/playlist?list=PLZ6b0WaGAsFmlYc2l53DZmGH-xIEnOTIr&feature=shared',
            videoCount: 57,
            VideoId: 'A1U70YTxEt0',
        },
        {
            shortForm: 'BS',
            name: 'Business Strategy',
            playlistLink: 'https://youtube.com/playlist?list=PLpE2olBViBD5sdnZBGG8k7pdo8xEbVYLQ&feature=shared',
            videoCount: 12,
            VideoId: 'UD89R9HC3RM',
        },
        {
            shortForm: 'FAC',
            name: 'Financial Accounting',
            playlistLink: 'https://youtube.com/playlist?list=PLR76vHGpX2Kakrv2XwizIcvMNEXm5ACV9&feature=shared',
            videoCount: 12,
            VideoId: '14XlEikyulo',
        },
        {
            shortForm: 'CS',
            name: 'Community Service',
            playlistLink: 'https://youtube.com/playlist?list=PLjIuADMrDKIZMDGsPiZWghLGVA_Xm14Ur&feature=shared',
            videoCount: 16,
            VideoId: 'cX6EoDm3DBE',
        },
        {
            shortForm: 'MAC',
            name: 'Macroeconomics',
            playlistLink: 'https://youtube.com/playlist?list=PL-fORSyPTUEKp8ECno63nnmu02beGOfn9&feature=shared',
            videoCount: 62,
            VideoId: 'BkNVbIOFnoQ',
        },
        {
            shortForm: 'HRM',
            name: 'Human Resource Management',
            playlistLink: 'https://youtube.com/playlist?list=PL9Cd7H8NFRQyHThG3ol8UEt4UD8Gyclo-&feature=shared',
            videoCount: 20,
            VideoId: 'tCKMsl49EyM',
        },
        {
            shortForm: 'ABC',
            name: 'Advanced Business Communication',
            playlistLink: 'https://youtube.com/playlist?list=PLsh2FvSr3n7eovNQqZ90abqSJyqYGs-GT&feature=shared',
            videoCount: 21,
            VideoId: 'BitO6ccFPws',
        },
        {
            shortForm: 'MBR',
            name: 'Methods in Business Research',
            playlistLink: 'https://youtube.com/playlist?list=PLsh2FvSr3n7eSNTEmfsUYHZseU-IJfgWX&feature=shared',
            videoCount: 17,
            VideoId: 'UWEElp3gesY',
        },
        {
            shortForm: 'SM',
            name: 'Strategic Management',
            playlistLink: 'https://youtube.com/playlist?list=PLIkqtRtuM1ToRbN4xa5Q2864LIK2vS6CN&feature=shared',
            videoCount: 33,
            VideoId: 'CMMUwNeBxyA',
        },
        {
            shortForm: 'BE',
            name: 'Basic Econometrics',
            playlistLink: 'https://youtube.com/playlist?list=PL23PGqNIMXjBL9xjOPjaAibNkxn6PO07y&feature=shared',
            videoCount: 37,
            VideoId: 'HgvviIK-GB8',
        },
        {
            shortForm: 'MIS',
            name: 'Management Information System',
            playlistLink: 'https://youtube.com/playlist?list=PLJtJvO3aaWe3yr3vNZWWWSjk7-CArNztG&feature=shared',
            videoCount: 11,
            VideoId: 'DaM0GIvW_yc',
        },
        {
            shortForm: 'BS',
            name: 'Business Statistics',
            playlistLink: 'https://youtube.com/playlist?list=PLQsC4_cbV7MD56Vr8VXT614zW-NyYLctu&feature=shared',
            videoCount: 16,
            VideoId: 'xleV983WN2I',
        },
        {
            shortForm: 'SI',
            name: 'Statistical Inference',
            playlistLink: 'https://youtube.com/playlist?list=PLybCHBiqtqWN1QT2PzRZDyiWP7p4N_tmI&feature=shared',
            videoCount: 27,
            VideoId: '-lYGMD09Zj0',
        },
        {
            shortForm: 'BCI',
            name: 'Business Communication I',
            playlistLink: 'https://youtube.com/playlist?list=PLTgj1ytGKarVj3qTZajRdkchDXJTXugi2&feature=shared',
            videoCount: 55,
            VideoId: 'usEQzPZWshw',
        },
        {
            shortForm: 'FBA',
            name: 'Fundamentals of Business Analytics',
            playlistLink: 'https://youtube.com/playlist?list=PLxgZQoSe9cg3pCpQaRr2q8crUcvIvwoNi&feature=shared',
            videoCount: 10,
            VideoId: 'rCFQukS8Org',
        },
        {
            shortForm: 'BDTM',
            name: 'Business Data and Text Mining',
            playlistLink: 'https://youtube.com/playlist?list=PLLy_2iUCG87C6Ni9RROAcJ7dKIcNMOtI5&feature=shared',
            videoCount: 41,
            VideoId: '7cmZResH3Ow',
        },
        {
            shortForm: 'PA',
            name: 'Predictive Analytics',
            playlistLink: 'https://youtube.com/playlist?list=PLUclz93rRZE8UnG_0IK6mI-hqQVo0wihH&feature=shared',
            videoCount: 26,
            VideoId: 'p5n_X8CNKKs',
        },
        {
            shortForm: 'DS',
            name: 'Discrete Structures',
            playlistLink: 'https://youtube.com/playlist?list=PLtCBuHKmdxOduWhQPbEwLN2ULKMqgQ44m&feature=shared',
            videoCount: 136,
            VideoId: 'yn7PquzSUUo',
        },
        {
            shortForm: 'LA',
            name: 'Linear Algebra',
            playlistLink: 'https://youtube.com/playlist?list=PLFD0EB975BA0CC1E0&feature=shared',
            videoCount: 144,
            VideoId: 'xyAuNHPsq-g',
        },
        {
            shortForm: 'DBS',
            name: 'Database Systems',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&feature=shared',
            videoCount: 135,
            VideoId: 'kBdlM6hNDAE',
        },
        {
            shortForm: 'OS',
            name: 'Operating System',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p&feature=shared',
            videoCount: 92,
            VideoId: 'bkSWJJZNgf8',
        },
        {
            shortForm: 'PS',
            name: 'Probability and Statistics',
            playlistLink: 'https://youtube.com/playlist?list=PLU6SqdYcYsfLRq3tu-g_hvkHDcorrtcBK&feature=shared',
            videoCount: 33,
            VideoId: 'V3iEsLPAD68',
        },
        {
            shortForm: 'DAA',
            name: 'Design and Analysis of Algorithms',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa&feature=shared',
            videoCount: 78,
            VideoId: 'u8JZ9gU5o4g',
        },
        {
            shortForm: 'AI',
            name: 'Artificial Intelligence',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI&feature=shared',
            videoCount: 55,
            VideoId: 'uB3i-qV6VdM',
        },
        {
            shortForm: 'CN',
            name: 'Computer Networks',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&feature=shared',
            videoCount: 103,
            VideoId: 'JFF2vJaN0Cw',
        },
        {
            shortForm: 'IS',
            name: 'Information Security',
            playlistLink: 'https://youtube.com/playlist?list=PLIwjtbLyaFQ6q4NtpZ3UTLYURR2BSn7IL&feature=shared',
            videoCount: 32,
            VideoId: 'q0uUpf7w93A',
        },
        {
            shortForm: 'OB',
            name: 'Organizational Behaviour',
            playlistLink: 'https://youtube.com/playlist?list=PLmAmHQ-_5ySyL_zgag85MMunZTomBdj6y&feature=shared',
            videoCount: 48,
            VideoId: 'pHg3ZfGk5j0',
        },
        {
            shortForm: 'CB',
            name: 'Consumer Behaviour',
            playlistLink: 'https://youtube.com/playlist?list=PL9t775MRIFAn4tNgGBmmBy2XK6hdFUHTO&feature=shared',
            videoCount: 36,
            VideoId: '2yisfk3UV9A',
        },
        {
            shortForm: 'OM',
            name: 'Operations Management',
            playlistLink: 'https://youtube.com/playlist?list=PLim9gWjsjN-OKNiSdjrv8Imb304zFteyI&feature=shared',
            videoCount: 54,
            VideoId: 'S1ejZAkGtiU',
        },
        {
            shortForm: 'DWBI',
            name: 'Data Warehousing and Business Intelligence',
            playlistLink: 'https://youtube.com/playlist?list=PLxCzCOWd7aiHexyDzYgry0YZN29e7HdNB&feature=shared',
            videoCount: 10,
            VideoId: 'NphMcnU8ymU',
        },
        {
            shortForm: 'DM',
            name: 'Data Mining',
            playlistLink: 'https://youtube.com/playlist?list=PLmAmHQ-_5ySxFoIGmY1MJao-XYvYGxxgj&feature=shared',
            videoCount: 28,
            VideoId: 'xEmrFePGjEg',
        },
        {
            shortForm: 'FM',
            name: 'Financial Management',
            playlistLink: 'https://youtube.com/playlist?list=PL2QJ8XVHGhXclNfLwxWu4UtHVqgZtxrRK&feature=shared',
            videoCount: 22,
            VideoId: 'MKLd1iw1lFw',
        },
        {
            shortForm: 'AICT',
            name: 'Applications of ICT',
            playlistLink: 'https://youtube.com/playlist?list=PLs5_Rtf2P2r6RWHu2DTaRb3B9kgo6wehT&feature=shared',
            videoCount: 14,
            VideoId: 'FCFsrIAqrXg',
        },
        {
            shortForm: 'AC',
            name: 'Applied Calculus',
            playlistLink: 'https://youtube.com/playlist?list=PLGtPmu26QR_VgoqyoERNNfdVjRbkOUVkl&feature=shared',
            videoCount: 53,
            VideoId: 'XLX4UPiqUpM',
        },
        {
            shortForm: 'ED',
            name: 'Engineering Drawing',
            playlistLink: 'https://youtube.com/playlist?list=PLpbJPNGxRsxLhNXIvOhPLmFpbP7Pq0qkh&feature=shared',
            videoCount: 14,
            VideoId: 'VkG_HRJ0fdg',
        },
        {
            shortForm: 'LCA',
            name: 'Linear Circuit Analysis',
            playlistLink: 'https://youtube.com/playlist?list=PLI_7H3Xw9-Wr1xZbthNGZ4sjH-lqLYC28&feature=shared',
            videoCount: 21,
            VideoId: 'ol9c1aACZDo',
        },
        {
            shortForm: 'LADE',
            name: 'Linear Algebra and Differential Equation',
            playlistLink: 'https://youtube.com/playlist?list=PLDEKrEe2g-sGz4OIOCKJyLsLola-5CLWk&feature=shared',
            videoCount: 28,
            VideoId: 'b9rs0g3b-eM',
        },
        {
            shortForm: 'EDC',
            name: 'Electronic Devices and Circuits',
            playlistLink: 'https://youtube.com/playlist?list=PLgwJf8NK-2e5G05PTgyTTSVyzTOKRfmTn&feature=shared',
            videoCount: 114,
            VideoId: 'OBiMpLoW8G8',
        },
        {
            shortForm: 'ENA',
            name: 'Electrical Network Analysis',
            playlistLink: 'https://youtube.com/playlist?list=PLu1wrAs8RubkpE0eiUoFG4q-_dyHbHkrO&feature=shared',
            videoCount: 173,
            VideoId: 'vX_LLNl-ZpU',
        },
        {
            shortForm: 'CVT',
            name: 'Complex Variables and Transform',
            playlistLink: 'https://youtube.com/playlist?list=PLt4l7npn1WNCw93FkjEKiwLUPivUb6O_W&feature=shared',
            videoCount: 39,
            VideoId: 'hCHpv8RRaTU',
        },
        {
            shortForm: 'SS',
            name: 'Signals and Systems',
            playlistLink: 'https://youtube.com/playlist?list=PLBlnK6fEyqRhG6s3jYIU48CqsT5cyiDTO&feature=shared',
            videoCount: 313,
            VideoId: 's8rsR_TStaA',
        },
        {
            shortForm: 'PRP',
            name: 'Probability and Random Processes',
            playlistLink: 'https://youtube.com/playlist?list=PLlQim6boihdhWW3ydjqgguPWPcv6N828W&feature=shared',
            videoCount: 46,
            VideoId: 'z9pANsmUF2A',
        },
        {
            shortForm: 'MIP',
            name: 'Microprocessor Interfacing and Programming',
            playlistLink: 'https://youtube.com/playlist?list=PLgwJf8NK-2e5vHwmowy_kGtjq9Ih0FzwN&feature=shared',
            videoCount: 100,
            VideoId: 'RP2sWt_oAWo',
        },
        {
            shortForm: 'ADC',
            name: 'Analogue and Digital Communication',
            playlistLink: 'https://youtube.com/playlist?list=PLwjK_iyK4LLArUHRm3SvPLT0XWlVhpl4h&feature=shared',
            videoCount: 33,
            VideoId: 'qhjj6WG7Rgc',
        },
        {
            shortForm: 'EMT',
            name: 'Electromagnetic Theory',
            playlistLink: 'https://youtube.com/playlist?list=PLgwJf8NK-2e4I_YltJja47CwZJkzNWK89&feature=shared',
            videoCount: 130,
            VideoId: 'vfu_mNbnHGM',
        },
        {
            shortForm: 'PDU',
            name: 'Power Distribution and Utilization',
            playlistLink: 'https://youtube.com/playlist?list=PLPnpZ3TxIpS2OUqTBzcvciDruNNIb8WKh&feature=shared',
            videoCount: 64,
            VideoId: 'KVW7A2R2dds',
        },
        {
            shortForm: 'FCS',
            name: 'Feedback Control Systems',
            playlistLink: 'https://youtube.com/playlist?list=PLCPLSoBCDMT-rcn3fxBqgY22L_OEeovwh&feature=shared',
            videoCount: 82,
            VideoId: '0LYdTrv1ZKY',
        },
        {
            shortForm: 'EE',
            name: 'Engineering Economics',
            playlistLink: 'https://youtube.com/playlist?list=PLRW1FgIW06IpkWmpIl_1qrXIPPzZdc7-V&feature=shared',
            videoCount: 22,
            VideoId: 'kega_QOCvxQ',
        },
        {
            shortForm: 'EM',
            name: 'Engineering Management',
            playlistLink: 'https://youtube.com/playlist?list=PLXPm4k-8ERi046Ltkll1hcbaeCeBTNbdF&feature=shared',
            videoCount: 26,
            VideoId: '1YOQCObJTnM',
        },
        {
            shortForm: 'CEM',
            name: 'Civil Engineering Materials',
            playlistLink: 'https://youtube.com/playlist?list=PLCV9OyAY5K-VFY3wvJeV-we8IFFyKPeUu&feature=shared',
            videoCount: 22,
            VideoId: 'JvF1VG_V59k',
        },
        {
            shortForm: 'ES',
            name: 'Engineering Surveying',
            playlistLink: 'https://youtube.com/playlist?list=PL_Neuu4K0N4Q13w6N6k8WF59VJGxk09kj&feature=shared',
            videoCount: 23,
            VideoId: 'FSwAc4i0zLo',
        },
        {
            shortForm: 'EM',
            name: 'Engineering Mechanics',
            playlistLink: 'https://youtube.com/playlist?list=PLDN15nk5uLiAyM7MbRBF1eIFC8y5vMRxI&feature=shared',
            videoCount: 414,
            VideoId: 'Vb1aMHC1_BM',
        },
        {
            shortForm: 'EG',
            name: 'Engineering Geology',
            playlistLink: 'https://youtube.com/playlist?list=PLm_MSClsnwm9m3u5EB38QBN43GzdiSLTR&feature=shared',
            videoCount: 40,
            VideoId: '-2A_pTP-14U',
        },
        {
            shortForm: 'FM',
            name: 'Fluid Mechanics',
            playlistLink: 'https://youtube.com/playlist?list=PLWPirh4EWFpGR5kjvxk_ZqopOtwdqS_uR&feature=shared',
            videoCount: 195,
            VideoId: 'YjngEKMR2V4',
        },
        {
            shortForm: 'AES',
            name: 'Advanced Engineering Surveying',
            playlistLink: 'https://youtube.com/playlist?list=PLRuJmSgJZObzS1W7tDUEpH9yflMMI3oY2&feature=shared',
            videoCount: 8,
            VideoId: 'CGiqXUFfM0Q',
        },
        {
            shortForm: 'MS',
            name: 'Mechanics of Solids I',
            playlistLink: 'https://youtube.com/playlist?list=PLgwJf8NK-2e53xcLCS7ay2iLRolNxyxFk&feature=shared',
            videoCount: 91,
            VideoId: 'WyR0NgO2tAU',
        }
    ];

  const [searchQuery, setSearchQuery] = useState("");
  const filteredPlaylists = playlists.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.shortForm &&
        course.shortForm.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleCardClick = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="playlists-page">
      <Navbar />
      {/* Header Section */}
      <header className="support-header">
        <h1>Youtube Playlists</h1>
        <p>Didn't understand the concept in class? We Got ya!</p>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search playlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>
          {" "}
          <FaSearch />{" "}
        </button>
      </div>

            {/* Playlists Section */}
            <div className="playlists-container">
                <div className="playlists">
                    {filteredPlaylists.map((course, index) => (
                        <div
                            key={index}
                            className="playlist-card stylish-card"
                            onClick={() => handleCardClick(course.playlistLink)}
                        >
                            <div className="thumbnail-container">
                                <img
                                    src={`https://i.ytimg.com/vi/${course.VideoId}/hqdefault.jpg`}
                                    alt={`Thumbnail for ${course.name}`}
                                    className="playlist-thumbnail"
                                />
                                <span className="short-form">{course.shortForm}</span>
                            </div>
                            <div className="card-content">
                                <h3>{course.name}</h3>
                                <p className="video-count">{course.videoCount} Videos</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BackToTopButton />
            <Footer />
        </div>
    );
};

export default PlaylistsPage;
