-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 14, 2023 at 04:55 PM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bashdb_final`
--

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
CREATE TABLE IF NOT EXISTS `content` (
  `content_title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_length` int(11) NOT NULL,
  `uploader` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_key` int(11) NOT NULL AUTO_INCREMENT,
  `location_vid` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`content_key`),
  KEY `fk_uploader` (`uploader`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content`
--

INSERT INTO `content` (`content_title`, `content_type`, `video_length`, `uploader`, `content_key`, `location_vid`) VALUES
('LUPANG HINIRANG - PHILIPPINE NATIONAL ANTHEM (1080p).mp4', 'video', 155, 'juancontent', 1, '/uploads/LUPANG HINIRANG - PHILIPPINE NATIONAL ANTHEM (1080p).mp4'),
('Saint Louis University Hymn (SLU Hymn) Baguio City (1080p50).mp4', 'video', 114, 'juancontent', 2, '/uploads/Saint Louis University Hymn (SLU Hymn) Baguio City (1080p50).mp4'),
('The SLU Prayer _ Saint Louis University (1080p).mp4', 'video', 160, 'juancontent', 3, '/uploads/The SLU Prayer _ Saint Louis University (1080p).mp4');

-- --------------------------------------------------------

--
-- Table structure for table `content_logs`
--

DROP TABLE IF EXISTS `content_logs`;
CREATE TABLE IF NOT EXISTS `content_logs` (
  `content_key` int(11) NOT NULL,
  `airing_date` date NOT NULL,
  `airing_start` time NOT NULL,
  `airing_end` time NOT NULL,
  PRIMARY KEY (`content_key`),
  KEY `fk_content_key` (`content_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_key` int(11) NOT NULL,
  `airing_date` date NOT NULL,
  `airing_start` time NOT NULL,
  `airing_end` time NOT NULL,
  `set_by` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `set_by_fk` (`set_by`),
  KEY `content_key` (`content_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `content_key`, `airing_date`, `airing_start`, `airing_end`, `set_by`) VALUES
(1, 1, '2023-12-16', '08:00:00', '08:02:35', 'juancontent'),
(2, 2, '2023-12-16', '08:02:35', '08:04:29', 'juancontent'),
(3, 3, '2023-12-16', '08:04:29', '08:07:09', 'juancontent');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `first_name`, `last_name`, `role`) VALUES
('bashdbadmin', 'admin123', 'Bash', 'DB', 'Admin'),
('juancontent', 'content', 'Juan', 'Dela Cruz', 'Content Manager');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `content`
--
ALTER TABLE `content`
  ADD CONSTRAINT `fk_uploader` FOREIGN KEY (`uploader`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `content_logs`
--
ALTER TABLE `content_logs`
  ADD CONSTRAINT `fk_content_key` FOREIGN KEY (`content_key`) REFERENCES `content` (`content_key`);

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `content_key` FOREIGN KEY (`content_key`) REFERENCES `content` (`content_key`),
  ADD CONSTRAINT `set_by_fk` FOREIGN KEY (`set_by`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
