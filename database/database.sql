-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 19, 2019 at 07:43 PM
-- Server version: 10.1.38-MariaDB-cll-lve
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `artomason_capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `Instructor_ID` int(10) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(50) NOT NULL,
  `Office` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `peer_review`
--

CREATE TABLE `peer_review` (
  `Peer_Review_ID` int(10) NOT NULL,
  `Reviewer_ID` int(10) NOT NULL,
  `Reviewee_ID` int(10) NOT NULL,
  `Contribution` int(30) NOT NULL,
  `Contribution_Comment` longtext NOT NULL,
  `Communication` int(30) NOT NULL,
  `Communication_Comment` longtext NOT NULL,
  `Teamwork` int(30) NOT NULL,
  `Teamwork_Comment` longtext NOT NULL,
  `General` int(30) NOT NULL,
  `General_Comment` longtext NOT NULL,
  `Overall` int(30) NOT NULL,
  `Overall_Comment` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `presentation_eval`
--

CREATE TABLE `presentation_eval` (
  `Presentation_Eval_ID` int(10) NOT NULL,
  `Project_ID` int(10) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Poster` int(30) NOT NULL,
  `Poster_Comment` longtext NOT NULL,
  `Teamtalk` int(30) NOT NULL,
  `Teamtalk_Comment` longtext NOT NULL,
  `Slides` int(30) NOT NULL,
  `Slides_Comment` longtext NOT NULL,
  `Presentation` int(30) NOT NULL,
  `Presentation_Comment` longtext NOT NULL,
  `Deliverables` int(30) NOT NULL,
  `Deliverables_Comment` longtext NOT NULL,
  `Softskills` int(30) NOT NULL,
  `Softskills_Comment` longtext NOT NULL,
  `Overall` int(30) NOT NULL,
  `Comment_on_Excellence` longtext NOT NULL,
  `Comment_on_Weakness` longtext NOT NULL,
  `Comment_on_Website` longtext NOT NULL,
  `Comment_on_Improvements` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `Project_ID` int(10) NOT NULL,
  `Term` varchar(30) NOT NULL,
  `Year` int(4) NOT NULL,
  `Project_No` varchar(100) NOT NULL,
  `Title` varchar(400) NOT NULL,
  `Description` longtext NOT NULL,
  `Student_Skills` longtext NOT NULL,
  `Student_Duties` longtext NOT NULL,
  `Student_Benefits` longtext NOT NULL,
  `Resources` longtext NOT NULL,
  `Instructor_ID` int(10) NOT NULL,
  `Sponsor_ID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `project_application`
--

CREATE TABLE `project_application` (
  `Application_ID` int(10) NOT NULL,
  `Student_ID` int(10) NOT NULL,
  `Project_ID` int(10) NOT NULL,
  `Preference_Order` int(1) NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `project_assignment`
--

CREATE TABLE `project_assignment` (
  `Student_ID` int(10) NOT NULL,
  `Project_ID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `project_sponsor`
--

CREATE TABLE `project_sponsor` (
  `Sponsor_ID` int(10) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(50) NOT NULL,
  `Office` longtext NOT NULL,
  `Organization_Name` longtext NOT NULL,
  `Job_Title` longtext NOT NULL,
  `Website` longtext NOT NULL,
  `Organization_Address` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sponsor_eval`
--

CREATE TABLE `sponsor_eval` (
  `Sponsor_Eval_ID` int(10) NOT NULL,
  `Sponsor_ID` int(10) NOT NULL,
  `Project_ID` int(10) NOT NULL,
  `Clarity` int(30) NOT NULL,
  `Clarity_Comment` longtext NOT NULL,
  `Quality` int(30) NOT NULL,
  `Quality_Comment` longtext NOT NULL,
  `Communication` int(30) NOT NULL,
  `Communication_Comment` longtext NOT NULL,
  `Commitment` int(30) NOT NULL,
  `Commitment_Comment` longtext NOT NULL,
  `Management` int(30) NOT NULL,
  `Management_Comment` longtext NOT NULL,
  `Overall` int(30) NOT NULL,
  `Overall_Comment` longtext NOT NULL,
  `Comment_on_Deliverables` longtext NOT NULL,
  `Comment_on_Team` longtext NOT NULL,
  `Feedback_on_Improvements` longtext NOT NULL,
  `Value_to_Organization` longtext NOT NULL,
  `Comment_on_Capstone` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sponsor_update`
--

CREATE TABLE `sponsor_update` (
  `Sponsor_Update_ID` int(10) NOT NULL,
  `Sponsor_ID` int(10) NOT NULL,
  `Project_ID` int(10) NOT NULL,
  `Date` datetime NOT NULL,
  `Progress` int(30) NOT NULL,
  `Responsiveness` int(30) NOT NULL,
  `Feedback` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `Student_ID` int(10) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `NetID` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student_update`
--

CREATE TABLE `student_update` (
  `Student_Update_ID` int(10) NOT NULL,
  `Student_ID` int(10) NOT NULL,
  `Project_ID` int(10) NOT NULL,
  `Date` datetime NOT NULL,
  `Progress` int(30) NOT NULL,
  `Summary` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`Instructor_ID`);

--
-- Indexes for table `peer_review`
--
ALTER TABLE `peer_review`
  ADD PRIMARY KEY (`Peer_Review_ID`),
  ADD KEY `Reviewer_ID` (`Reviewer_ID`),
  ADD KEY `Reviewee_ID` (`Reviewee_ID`);

--
-- Indexes for table `presentation_eval`
--
ALTER TABLE `presentation_eval`
  ADD PRIMARY KEY (`Presentation_Eval_ID`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`Project_ID`),
  ADD KEY `Instructor_ID` (`Instructor_ID`),
  ADD KEY `Sponsor_ID` (`Sponsor_ID`);

--
-- Indexes for table `project_application`
--
ALTER TABLE `project_application`
  ADD PRIMARY KEY (`Application_ID`),
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- Indexes for table `project_assignment`
--
ALTER TABLE `project_assignment`
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- Indexes for table `project_sponsor`
--
ALTER TABLE `project_sponsor`
  ADD PRIMARY KEY (`Sponsor_ID`);

--
-- Indexes for table `sponsor_eval`
--
ALTER TABLE `sponsor_eval`
  ADD PRIMARY KEY (`Sponsor_Eval_ID`),
  ADD KEY `Sponsor_ID` (`Sponsor_ID`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- Indexes for table `sponsor_update`
--
ALTER TABLE `sponsor_update`
  ADD PRIMARY KEY (`Sponsor_Update_ID`),
  ADD KEY `Sponsor_ID` (`Sponsor_ID`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`Student_ID`);

--
-- Indexes for table `student_update`
--
ALTER TABLE `student_update`
  ADD PRIMARY KEY (`Student_Update_ID`),
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `Instructor_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `peer_review`
--
ALTER TABLE `peer_review`
  MODIFY `Peer_Review_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `presentation_eval`
--
ALTER TABLE `presentation_eval`
  MODIFY `Presentation_Eval_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `Project_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_application`
--
ALTER TABLE `project_application`
  MODIFY `Application_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_sponsor`
--
ALTER TABLE `project_sponsor`
  MODIFY `Sponsor_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sponsor_eval`
--
ALTER TABLE `sponsor_eval`
  MODIFY `Sponsor_Eval_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sponsor_update`
--
ALTER TABLE `sponsor_update`
  MODIFY `Sponsor_Update_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `Student_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_update`
--
ALTER TABLE `student_update`
  MODIFY `Student_Update_ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `peer_review`
--
ALTER TABLE `peer_review`
  ADD CONSTRAINT `fk_peer_review_reviewee` FOREIGN KEY (`Reviewee_ID`) REFERENCES `student` (`Student_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_peer_review_reviewer` FOREIGN KEY (`Reviewer_ID`) REFERENCES `student` (`Student_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `presentation_eval`
--
ALTER TABLE `presentation_eval`
  ADD CONSTRAINT `fk_presentation_eval_project` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `fk_project_instructor` FOREIGN KEY (`Instructor_ID`) REFERENCES `instructor` (`Instructor_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_sponsor` FOREIGN KEY (`Sponsor_ID`) REFERENCES `project_sponsor` (`Sponsor_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `project_application`
--
ALTER TABLE `project_application`
  ADD CONSTRAINT `fk_project_application_project` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_application_student` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `project_assignment`
--
ALTER TABLE `project_assignment`
  ADD CONSTRAINT `fk_project_assignment_project` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_assignment_student` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `sponsor_eval`
--
ALTER TABLE `sponsor_eval`
  ADD CONSTRAINT `fk_sponsor_eval_project` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sponsor_eval_sponsor` FOREIGN KEY (`Sponsor_ID`) REFERENCES `project_sponsor` (`Sponsor_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `sponsor_update`
--
ALTER TABLE `sponsor_update`
  ADD CONSTRAINT `fk_sponsor_update_project` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sponsor_update_sponsor` FOREIGN KEY (`Sponsor_ID`) REFERENCES `project_sponsor` (`Sponsor_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `student_update`
--
ALTER TABLE `student_update`
  ADD CONSTRAINT `fk_student_update_project` FOREIGN KEY (`Project_ID`) REFERENCES `project` (`Project_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_student_update_student` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
