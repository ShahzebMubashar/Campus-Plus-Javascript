import React, { useState } from "react";
import "./PlaylistsPage.css";
import Navbar from "../Index/components/Navbar.js";
import { FaSearch } from "react-icons/fa";
import Footer from "../Footer/Footer.js";
import BackToTopButton from "../Index/components/BackToTop";

const PlaylistsPage = () => {
  const playlists = [
    {
      name: "Programming Fundamentals (PF)",
      shortForm: "PF",
      watchtime: "Apna College",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&feature=shared",
      duration: "226 Videos",
      VideoId: "z9bZufPHFLU",
    },
    {
      name: "Applied Physics (AP)",
      shortForm: "AP",
      watchtime: "JE CLASSES Meerut",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLY8pCdWSlXrT0w1Yu3jU_lTUCkfFKVOm_&feature=shared",
      duration: "86 Videos",
      VideoId: "AquETg8G0es",
    },
    {
      name: "Calculus and Analytical Geometry (CAL)",
      shortForm: "CAL",
      watchtime: "The Organic Chemistry Tutor",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv&feature=shared",
      duration: "332 Videos",
      VideoId: "GiCojsAWRj0",
    },
    {
      name: "Object Oriented Programming (OOP)",
      shortForm: "OOP",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&feature=shared",
      duration: "37 Videos",
      VideoId: "nGJTWaaFdjc",
    },
    {
      name: "Digital Logic Design (DLD)",
      shortForm: "DLD",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&feature=shared",
      duration: "202 Videos",
      VideoId: "M0mx8S05v60",
    },
    {
      name: "Multivariable Calculus (MVC)",
      shortForm: "MVC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLSQl0a2vh4HC5feHa6Rc5c0wbRTx56nF7&feature=shared",
      duration: "175 Videos",
      VideoId: "TrcCbdWwCBc",
    },
    // New Playlists
    {
      name: "Data Structures (DS)",
      shortForm: "DS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLAXnLdrLnQpRcveZTtD644gM9uzYqJCwr&feature=shared",
      duration: "163 Videos",
      VideoId: "0IAPZzGSbME",
    },
    {
      name: "Computer Organization and Assembly Language (COAL)",
      shortForm: "COAL",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLAZj-jE2acZLdYT7HLFgNph190z2cjmAG&feature=shared",
      duration: "18 Videos",
      VideoId: "_BpOV3G1-m0",
    },
    {
      name: "Parallel and Distributed Computing (PDC)",
      shortForm: "PDC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL0s3O6GgLL5fbwQ8HBuK0Bh--GZzM8j1M&feature=shared",
      duration: "12 Videos",
      VideoId: "tWRL2VJL-FA",
    },
    {
      name: "Theory of Automata (TA)",
      shortForm: "TA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T&feature=shared",
      duration: "112 Videos",
      VideoId: "9kuynHcM3UA",
    },
    {
      name: "Software Engineering (SE)",
      shortForm: "SE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&feature=shared",
      duration: "58 Videos",
      VideoId: "uJpQlyT_CK4",
    },
    {
      name: "Computer Architecture (CA)",
      shortForm: "CA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX&feature=shared",
      duration: "66 Videos",
      VideoId: "L9X7XXfHYdU",
    },
    {
      name: "Applied Human Computer Interaction (AHCI)",
      shortForm: "AHCI",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLYwpaL_SFmcDz_8-pygbcNvNF0DEwKoIL&feature=shared",
      duration: "29 Videos",
      VideoId: "Pf_zJ2oRMEU",
    },
    {
      name: "Compiler Construction (CC)",
      shortForm: "CC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc&feature=shared",
      duration: "39 Videos",
      VideoId: "XUsw5igq4DM",
    },
    {
      name: "Advanced Database Management System (ADMS)",
      shortForm: "ADMS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLm9FYbXgpdMqq310GHRv30ltrjWFcB5RU&feature=shared",
      duration: "80 Videos",
      VideoId: "iUApyIf2h-A",
    },
    {
      name: "Software Requirements Engineering (SRE)",
      shortForm: "SRE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLptLP7KjDoqVcNGqntp2FhuWHGNe6evcb&feature=shared",
      duration: "30 Videos",
      VideoId: "YV0GfAoEhnM",
    },
    {
      name: "Software Design and Architecture (SDA)",
      shortForm: "SDA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLfX2IHFUV0cEenh8hld1s3MmtGdCNYBCg&feature=shared",
      duration: "30 Videos",
      VideoId: "xtZwezSAzTA",
    },
    {
      name: "Software Construction & Development (SCD)",
      shortForm: "SCD",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLmeQIS8S5cYMNI2W3t-h_tJ3uTJjeafzy&feature=shared",
      duration: "11 Videos",
      VideoId: "9LDm4Ss181E",
    },
    {
      name: "Software Quality Engineering (SQE)",
      shortForm: "SQE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLKyB9RYzaFRhUPKcG5iGIChnifC12ylP5&feature=shared",
      duration: "230 Videos",
      VideoId: "I2d86QjR8YM",
    },
    {
      name: "Fundamentals of Software Project Management (FSPM)",
      shortForm: "FSPM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL7FvtDeeLOS8uJQb3sF6x3VOyHY_WJj_5&feature=shared",
      duration: "35 Videos",
      VideoId: "QET1yfK49ZE",
    },
    {
      name: "Introduction to Data Science (IDS)",
      shortForm: "IDS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLMrJAkhIeNNQV7wi9r7Kut8liLFMWQOXn&feature=shared",
      duration: "20 Videos",
      VideoId: "pzo13OPXZS4",
    },
    {
      name: "Fundamentals of Software Engineering (FSE)",
      shortForm: "FSE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2&feature=shared",
      duration: "58 Videos",
      VideoId: "uJpQlyT_CK4",
    },
    {
      name: "Fundamentals of Accounting (FA)",
      shortForm: "FA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLiaygP8qeQGXgy77KXabPdkO5ZFbskgtm&feature=shared",
      duration: "20 Videos",
      VideoId: "dCi-mNlf96Y",
    },
    {
      name: "Fundamentals of Management (FM)",
      shortForm: "FM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLJtJvO3aaWe16eg-L7sJ1Ww3021CWlJU9&feature=shared",
      duration: "14 Videos",
      VideoId: "I6-QB-EIdsE",
    },
    {
      name: "Psychology/Sociology",
      shortForm: "PSY",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLyUsz36A6UmUZ5AyBMa8yh_OZvbIaRiu6&feature=shared",
      duration: "34 Videos",
      VideoId: "DbTt_ySTjaY",
    },
    {
      name: "Data Analysis for Business I",
      shortForm: "DAB",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLim9gWjsjN-NjHF51E0mz9CnledJ3cN4r&feature=shared",
      duration: "30 Videos",
      VideoId: "ffwEAprsel8",
    },
    {
      name: "Marketing Management",
      shortForm: "MM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLaAhQ2ofZZRBhZEC2Oqm-vg2iMeOo1V7J&feature=shared",
      duration: "23 Videos",
      VideoId: "UMfWG1meBBc",
    },
    {
      name: "Microeconomics",
      shortForm: "ME",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLZ6b0WaGAsFmlYc2l53DZmGH-xIEnOTIr&feature=shared",
      duration: "57 Videos",
      VideoId: "A1U70YTxEt0",
    },
    {
      name: "Business Strategy",
      shortForm: "BS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLpE2olBViBD5sdnZBGG8k7pdo8xEbVYLQ&feature=shared",
      duration: "12 Videos",
      VideoId: "UD89R9HC3RM",
    },
    {
      name: "Financial Accounting",
      shortForm: "FAC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLR76vHGpX2Kakrv2XwizIcvMNEXm5ACV9&feature=shared",
      duration: "12 Videos",
      VideoId: "14XlEikyulo",
    },
    {
      name: "Community Service",
      shortForm: "CS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLjIuADMrDKIZMDGsPiZWghLGVA_Xm14Ur&feature=shared",
      duration: "16 Videos",
      VideoId: "cX6EoDm3DBE",
    },
    {
      name: "Macroeconomics",
      shortForm: "MAC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL-fORSyPTUEKp8ECno63nnmu02beGOfn9&feature=shared",
      duration: "62 Videos",
      VideoId: "BkNVbIOFnoQ",
    },
    {
      name: "Human Resource Management",
      shortForm: "HRM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL9Cd7H8NFRQyHThG3ol8UEt4UD8Gyclo-&feature=shared",
      duration: "20 Videos",
      VideoId: "tCKMsl49EyM",
    },
    {
      name: "Advanced Business Communication",
      shortForm: "ABC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLsh2FvSr3n7eovNQqZ90abqSJyqYGs-GT&feature=shared",
      duration: "21 Videos",
      VideoId: "BitO6ccFPws",
    },
    {
      name: "Methods in Business Research",
      shortForm: "MBR",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLsh2FvSr3n7eSNTEmfsUYHZseU-IJfgWX&feature=shared",
      duration: "17 Videos",
      VideoId: "UWEElp3gesY",
    },
    {
      name: "Strategic Management",
      shortForm: "SM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLIkqtRtuM1ToRbN4xa5Q2864LIK2vS6CN&feature=shared",
      duration: "33 Videos",
      VideoId: "CMMUwNeBxyA",
    },
    {
      name: "Basic Econometrics",
      shortForm: "BE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL23PGqNIMXjBL9xjOPjaAibNkxn6PO07y&feature=shared",
      duration: "37 Videos",
      VideoId: "HgvviIK-GB8",
    },
    {
      name: "Management Information System",
      shortForm: "MIS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLJtJvO3aaWe3yr3vNZWWWSjk7-CArNztG&feature=shared",
      duration: "11 Videos",
      VideoId: "DaM0GIvW_yc",
    },
    {
      name: "Business Statistics",
      shortForm: "BS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLQsC4_cbV7MD56Vr8VXT614zW-NyYLctu&feature=shared",
      duration: "16 Videos",
      VideoId: "xleV983WN2I",
    },
    {
      name: "Statistical Inference",
      shortForm: "SI",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLybCHBiqtqWN1QT2PzRZDyiWP7p4N_tmI&feature=shared",
      duration: "27 Videos",
      VideoId: "-lYGMD09Zj0",
    },
    {
      name: "Business Communication I",
      shortForm: "BCI",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLTgj1ytGKarVj3qTZajRdkchDXJTXugi2&feature=shared",
      duration: "55 Videos",
      VideoId: "usEQzPZWshw",
    },
    {
      name: "Fundamentals of Business Analytics",
      shortForm: "FBA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxgZQoSe9cg3pCpQaRr2q8crUcvIvwoNi&feature=shared",
      duration: "10 Videos",
      VideoId: "rCFQukS8Org",
    },
    {
      name: "Business Data and Text Mining",
      shortForm: "BDTM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLLy_2iUCG87C6Ni9RROAcJ7dKIcNMOtI5&feature=shared",
      duration: "41 Videos",
      VideoId: "7cmZResH3Ow",
    },
    {
      name: "Predictive Analytics",
      shortForm: "PA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLUclz93rRZE8UnG_0IK6mI-hqQVo0wihH&feature=shared",
      duration: "26 Videos",
      VideoId: "p5n_X8CNKKs",
    },
    {
      name: "Discrete Structures",
      shortForm: "DS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLtCBuHKmdxOduWhQPbEwLN2ULKMqgQ44m&feature=shared",
      duration: "136 Videos",
      VideoId: "yn7PquzSUUo",
    },
    {
      name: "Linear Algebra",
      shortForm: "LA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLFD0EB975BA0CC1E0&feature=shared",
      duration: "144 Videos",
      VideoId: "xyAuNHPsq-g",
    },
    {
      name: "Database Systems",
      shortForm: "DBS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&feature=shared",
      duration: "135 Videos",
      VideoId: "kBdlM6hNDAE",
    },
    {
      name: "Operating System",
      shortForm: "OS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p&feature=shared",
      duration: "92 Videos",
      VideoId: "bkSWJJZNgf8",
    },
    {
      name: "Probability and Statistics",
      shortForm: "PS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLU6SqdYcYsfLRq3tu-g_hvkHDcorrtcBK&feature=shared",
      duration: "33 Videos",
      VideoId: "V3iEsLPAD68",
    },
    {
      name: "Design and Analysis of Algorithms",
      shortForm: "DAA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa&feature=shared",
      duration: "78 Videos",
      VideoId: "u8JZ9gU5o4g",
    },
    {
      name: "Artificial Intelligence",
      shortForm: "AI",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI&feature=shared",
      duration: "55 Videos",
      VideoId: "uB3i-qV6VdM",
    },
    {
      name: "Computer Networks",
      shortForm: "CN",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&feature=shared",
      duration: "103 Videos",
      VideoId: "JFF2vJaN0Cw",
    },
    {
      name: "Information Security",
      shortForm: "IS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLIwjtbLyaFQ6q4NtpZ3UTLYURR2BSn7IL&feature=shared",
      duration: "32 Videos",
      VideoId: "q0uUpf7w93A",
    },
    {
      name: "Organizational Behaviour",
      shortForm: "OB",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLmAmHQ-_5ySyL_zgag85MMunZTomBdj6y&feature=shared",
      duration: "48 Videos",
      VideoId: "pHg3ZfGk5j0",
    },
    {
      name: "Consumer Behaviour",
      shortForm: "CB",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL9t775MRIFAn4tNgGBmmBy2XK6hdFUHTO&feature=shared",
      duration: "36 Videos",
      VideoId: "2yisfk3UV9A",
    },
    {
      name: "Operations Management",
      shortForm: "OM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLim9gWjsjN-OKNiSdjrv8Imb304zFteyI&feature=shared",
      duration: "54 Videos",
      VideoId: "S1ejZAkGtiU",
    },
    {
      name: "Data Warehousing and Business Intelligence",
      shortForm: "DWBI",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLxCzCOWd7aiHexyDzYgry0YZN29e7HdNB&feature=shared",
      duration: "10 Videos",
      VideoId: "NphMcnU8ymU",
    },
    {
      name: "Data Mining",
      shortForm: "DM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLmAmHQ-_5ySxFoIGmY1MJao-XYvYGxxgj&feature=shared",
      duration: "28 Videos",
      VideoId: "xEmrFePGjEg",
    },
    {
      name: "Financial Management",
      shortForm: "FM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL2QJ8XVHGhXclNfLwxWu4UtHVqgZtxrRK&feature=shared",
      duration: "22 Videos",
      VideoId: "MKLd1iw1lFw",
    },
    {
      name: "Applications of ICT",
      shortForm: "AICT",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLs5_Rtf2P2r6RWHu2DTaRb3B9kgo6wehT&feature=shared",
      duration: "14 Videos",
      VideoId: "FCFsrIAqrXg",
    },
    {
      name: "Applied Calculus",
      shortForm: "AC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLGtPmu26QR_VgoqyoERNNfdVjRbkOUVkl&feature=shared",
      duration: "53 Videos",
      VideoId: "XLX4UPiqUpM",
    },
    {
      name: "Engineering Drawing",
      shortForm: "ED",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLpbJPNGxRsxLhNXIvOhPLmFpbP7Pq0qkh&feature=shared",
      duration: "14 Videos",
      VideoId: "VkG_HRJ0fdg",
    },
    {
      name: "Linear Circuit Analysis",
      shortForm: "LCA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLI_7H3Xw9-Wr1xZbthNGZ4sjH-lqLYC28&feature=shared",
      duration: "21 Videos",
      VideoId: "ol9c1aACZDo",
    },
    {
      name: "Linear Algebra and Differential Equation",
      shortForm: "LADE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLDEKrEe2g-sGz4OIOCKJyLsLola-5CLWk&feature=shared",
      duration: "28 Videos",
      VideoId: "b9rs0g3b-eM",
    },
    {
      name: "Electronic Devices and Circuits",
      shortForm: "EDC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLgwJf8NK-2e5G05PTgyTTSVyzTOKRfmTn&feature=shared",
      duration: "114 Videos",
      VideoId: "OBiMpLoW8G8",
    },
    {
      name: "Electrical Network Analysis",
      shortForm: "ENA",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLu1wrAs8RubkpE0eiUoFG4q-_dyHbHkrO&feature=shared",
      duration: "173 Videos",
      VideoId: "vX_LLNl-ZpU",
    },
    {
      name: "Complex Variables and Transform",
      shortForm: "CVT",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLt4l7npn1WNCw93FkjEKiwLUPivUb6O_W&feature=shared",
      duration: "39 Videos",
      VideoId: "hCHpv8RRaTU",
    },
    {
      name: "Signals and Systems",
      shortForm: "SS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLBlnK6fEyqRhG6s3jYIU48CqsT5cyiDTO&feature=shared",
      duration: "313 Videos",
      VideoId: "s8rsR_TStaA",
    },
    {
      name: "Probability and Random Processes",
      shortForm: "PRP",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLlQim6boihdhWW3ydjqgguPWPcv6N828W&feature=shared",
      duration: "46 Videos",
      VideoId: "z9pANsmUF2A",
    },
    {
      name: "Microprocessor Interfacing and Programming",
      shortForm: "MIP",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLgwJf8NK-2e5vHwmowy_kGtjq9Ih0FzwN&feature=shared",
      duration: "100 Videos",
      VideoId: "RP2sWt_oAWo",
    },
    {
      name: "Analogue and Digital Communication",
      shortForm: "ADC",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLwjK_iyK4LLArUHRm3SvPLT0XWlVhpl4h&feature=shared",
      duration: "33 Videos",
      VideoId: "qhjj6WG7Rgc",
    },
    {
      name: "Electromagnetic Theory",
      shortForm: "EMT",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLgwJf8NK-2e4I_YltJja47CwZJkzNWK89&feature=shared",
      duration: "130 Videos",
      VideoId: "vfu_mNbnHGM",
    },
    {
      name: "Power Distribution and Utilization",
      shortForm: "PDU",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLPnpZ3TxIpS2OUqTBzcvciDruNNIb8WKh&feature=shared",
      duration: "64 Videos",
      VideoId: "KVW7A2R2dds",
    },
    {
      name: "Feedback Control Systems",
      shortForm: "FCS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLCPLSoBCDMT-rcn3fxBqgY22L_OEeovwh&feature=shared",
      duration: "82 Videos",
      VideoId: "0LYdTrv1ZKY",
    },
    {
      name: "Engineering Economics",
      shortForm: "EE",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLRW1FgIW06IpkWmpIl_1qrXIPPzZdc7-V&feature=shared",
      duration: "22 Videos",
      VideoId: "kega_QOCvxQ",
    },
    {
      name: "Engineering Management",
      shortForm: "EM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLXPm4k-8ERi046Ltkll1hcbaeCeBTNbdF&feature=shared",
      duration: "26 Videos",
      VideoId: "1YOQCObJTnM",
    },
    {
      name: "Civil Engineering Materials",
      shortForm: "CEM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLCV9OyAY5K-VFY3wvJeV-we8IFFyKPeUu&feature=shared",
      duration: "22 Videos",
      VideoId: "JvF1VG_V59k",
    },
    {
      name: "Engineering Surveying",
      shortForm: "ES",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PL_Neuu4K0N4Q13w6N6k8WF59VJGxk09kj&feature=shared",
      duration: "23 Videos",
      VideoId: "FSwAc4i0zLo",
    },
    {
      name: "Engineering Mechanics",
      shortForm: "EM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLDN15nk5uLiAyM7MbRBF1eIFC8y5vMRxI&feature=shared",
      duration: "414 Videos",
      VideoId: "Vb1aMHC1_BM",
    },
    {
      name: "Engineering Geology",
      shortForm: "EG",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLm_MSClsnwm9m3u5EB38QBN43GzdiSLTR&feature=shared",
      duration: "40 Videos",
      VideoId: "-2A_pTP-14U",
    },
    {
      name: "Fluid Mechanics",
      shortForm: "FM",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLWPirh4EWFpGR5kjvxk_ZqopOtwdqS_uR&feature=shared",
      duration: "195 Videos",
      VideoId: "YjngEKMR2V4",
    },
    {
      name: "Advanced Engineering Surveying",
      shortForm: "AES",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLRuJmSgJZObzS1W7tDUEpH9yflMMI3oY2&feature=shared",
      duration: "8 Videos",
      VideoId: "CGiqXUFfM0Q",
    },
    {
      name: "Mechanics of Solids I",
      shortForm: "MS",
      watchtime: "Duration: 20 Hours",
      rating: 4.8,
      students: "20 Students",
      playlistLink:
        "https://youtube.com/playlist?list=PLgwJf8NK-2e53xcLCS7ay2iLRolNxyxFk&feature=shared",
      duration: "91 Videos",
      VideoId: "WyR0NgO2tAU",
    },
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
              <img
                src={`https://i.ytimg.com/vi/${course.VideoId}/hqdefault.jpg`}
                alt={`Thumbnail for ${course.name}`}
                className="playlist-thumbnail"
              />
              <div className="card-content">
                <h3>{course.name}</h3>
                <p className="creator">{course.watchtime}</p>
                <p className="rating">
                  {"⭐".repeat(Math.round(course.rating))}
                </p>
                <div className="horizontal-info">
                  <p>🎥 {course.duration}</p>
                  <p>👥 {course.students}</p>
                </div>
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
